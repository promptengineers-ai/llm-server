import ujson
import logging
import sys
import asyncio
from typing import List, Any

from langchain.docstore.document import Document

from src.config import REDIS_URL
from src.db.strategies import VectorstoreContext
from src.factories import EmbeddingFactory, RetrievalFactory, LoaderFactory
from src.models import UpsertDocuments, Splitter
from src.services.cache import CacheService
from src.utils.validation import Validator
from src.utils.retrieval import split_docs

cache = CacheService(REDIS_URL)
validtor = Validator()

def to_serializable(obj):
    """
    Recursively convert an object and its nested properties into dictionaries.
    """
    if isinstance(obj, dict):
        return {key: to_serializable(val) for key, val in obj.items()}
    elif hasattr(obj, "__dict__"):  # Check if it is a custom class
        return {key: to_serializable(val) for key, val in obj.__dict__.items() if not key.startswith("_")}
    elif isinstance(obj, list):
        return [to_serializable(item) for item in obj]
    elif isinstance(obj, (str, int, float, bool, type(None))):  # Add any other types you consider "primitive"
        return obj
    else:
        # For other types, you might want to convert them to string, or handle them specifically.
        # You might also raise an error or warning here, depending on your needs.
        return str(obj)
    
    
async def upsert_documents_batch(vectorstore_service, batch: List[Document]):
    # Assuming vectorstore_service.add() is an asynchronous function or
    # you have an async wrapper around it.
    result = await vectorstore_service.add(batch)
    return result

async def upsert_all_in_parallel(vectorstore_service, documents, batch_size=100):
    # Split documents into batches
    batches = [documents[i:i+batch_size] for i in range(0, len(documents), batch_size)]
    
    # Create a list of future tasks for each batch
    tasks = [upsert_documents_batch(vectorstore_service, batch) for batch in batches]
    
    # Run tasks concurrently and wait for all of them to complete
    results = await asyncio.gather(*tasks)
    
    # Process results if needed
    return results

class DocumentService:

	##############################################################
	### Get Documents
	##############################################################
	async def from_loaders(
		loaders: List[Any],
		splitter = Splitter,
		task_id: str = None
	):
		# Generate Loaders
		docs = []
		for loader_config in loaders:
			try:
				loader = LoaderFactory.create(
					loader_type=loader_config['type'], 
					loader_config=loader_config
				)
				await cache.publish(
					task_id, 
					ujson.dumps({
						'step': 'start',
						'message': f'Scraping {loader_config["type"]} loader.',
						'progress': 0, 
						'page_number': 0,
						'page_count': 0,
						'chunk_count': 0
					})
				)
				loader = loader.load()
				logging.warning(f"{sys.getsizeof(loader)} bytes of memory used by {loader_config['type']} loader.")
				await cache.publish(
					task_id, 
					ujson.dumps({
						'step': 'scrape',
						'message': f'Finished scraping {len(loader)} pages.',
						'progress': 0, 
						'page_number': 0,
						'page_count': len(loader),
						'chunk_count': 0 
					})
				)
				for i, doc in enumerate(loader):
					doc.metadata['page'] = i + 1
					docs.append(doc)
     
				logging.debug(f"Loaded {len(docs)} documents from {loader_config['type']}")
			except ValueError as e:
				raise ValueError(f"Invalid loader type: {e}")
			except Exception as e:
				raise Exception(f"Unexpected error: {e}")
  
		if splitter.type:
			return await split_docs(
				docs, 
				splitter.chunk_size, 
				splitter.chunk_overlap, 
				splitter.type,
				task_id,
			)
		return docs

	##############################################################
	### Upsert Documents
	##############################################################
	async def upsert(
		body: UpsertDocuments,
		tokens: dict,
		keys: set,
		user_id: str,
	):
  		# Generate Embeddings
		embedding = EmbeddingFactory(body.embedding, tokens.get('OPENAI_API_KEY'))
  
		# Generate Provider Keys
		if body.provider == 'redis':
			# Validate API keys
			validtor.validate_api_keys(tokens, keys)
			provider_keys={
				'redis_url': tokens.get('REDIS_URL'),
				'index_name': f"{user_id}::{body.index_name}",
			}
		elif body.provider == 'pinecone':
			# Validate API keys
			validtor.validate_api_keys(tokens, keys)
			provider_keys = {
				'api_key': tokens.get('PINECONE_API_KEY'),
				'env': tokens.get('PINECONE_ENV'),
				'index_name': tokens.get('PINECONE_INDEX'),
				'namespace': f"{user_id}::{body.index_name}",
			}
		else:
			raise ValueError(f"Invalid retrieval provider: {body.provider}")
  
		retrieval_provider = RetrievalFactory(
			provider=body.provider,
			embeddings=embedding.create_embedding(),
			provider_keys=provider_keys
		)
		# Create a vector store service context
		vectostore_service = VectorstoreContext(retrieval_provider.create_strategy())
		documents = list(map(lambda x: Document(page_content=str(x.page_content), 
                            metadata=to_serializable(x.metadata)), body.documents))
		# result = vectostore_service.add(documents)
		result = await upsert_all_in_parallel(vectostore_service, documents) # TODO: Try again
		if result:
			return result
		return False