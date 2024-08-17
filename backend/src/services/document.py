import ujson
from src.infrastructure.logger import logger as logging
import sys
import asyncio
from typing import List, Any

from langchain.docstore.document import Document
from concurrent.futures import ThreadPoolExecutor

from src.config import REDIS_URL
from src.db.strategies import VectorstoreContext
from src.factories import EmbeddingFactory, RetrievalFactory, LoaderFactory
from src.models import UpsertDocuments, Splitter
from src.services.cache import CacheService
from src.utils.validation import Validator
from src.utils.retrieval import split_docs

cache = CacheService(REDIS_URL)
validtor = Validator()
	

class DocumentService:
	def __init__(self, batch_size=32, parallel: bool = False, workers: int = 4):
		self.batch_size: int = batch_size
		self.vectorstore_service: VectorstoreContext = None
		self.parallel: bool = parallel
		self.workers: int = workers
		self.executor = ThreadPoolExecutor(max_workers=self.workers) 
		
	##############################################################
	### Convert to Serializable
	##############################################################
	def to_serializable(self, obj):
		"""
		Recursively convert an object and its nested properties into dictionaries.
		"""
		if isinstance(obj, dict):
			return {key: self.to_serializable(val) for key, val in obj.items()}
		elif hasattr(obj, "__dict__"):  # Check if it is a custom class
			return {key: self.to_serializable(val) for key, val in obj.__dict__.items() if not key.startswith("_")}
		elif isinstance(obj, list):
			return [self.to_serializable(item) for item in obj]
		elif isinstance(obj, (str, int, float, bool, type(None))):  # Add any other types you consider "primitive"
			return obj
		else:
			# For other types, you might want to convert them to string, or handle them specifically.
			# You might also raise an error or warning here, depending on your needs.
			return str(obj)

	##############################################################
	### Get Documents
	##############################################################
	async def from_loaders(
		self,
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
	 	self,
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
		elif body.provider == 'postgres':
			# Validate API keys
			validtor.validate_api_keys(tokens, keys)
			provider_keys={
				'connection': tokens.get('POSTGRES_URL'),
				'collection_name': f"{user_id}::{body.index_name}",
			}
		else:
			raise ValueError(f"Invalid retrieval provider: {body.provider}")
  
		retrieval_provider = RetrievalFactory(
			provider=body.provider,
			embeddings=embedding.create_embedding(),
			provider_keys=provider_keys
		)
		# Create a vector store service context
		self.vectorstore_service = VectorstoreContext(retrieval_provider.create_strategy())
		if body.provider == 'postgres':
			self.vectorstore_service.strategy.service.client.create_tables_if_not_exists()
  
		# Add logging to verify the initialization
		logging.debug(f"Vectorstore service initialized: {self.vectorstore_service}")
  
		# Format Documents
		documents = list(map(lambda x: Document(page_content=str(x.page_content), 
							metadata=self.to_serializable(x.metadata)), body.documents))

		# Upsert Documents
		result = None
		try:
			if self.parallel:
				result = await self.upsert_in_parallel_batches(documents)
			else:
				result = await self.upsert_in_batches(documents, task_id=body.task_id)
		except Exception as e:
			logging.exception(e)
		if result:
			return result
		return False

	##############################################################
	### Upsert Documents
	##############################################################
	async def upsert_documents(self, documents: List[Document]):		
		try:
			if self.parallel:
				loop = asyncio.get_event_loop()
				result = await loop.run_in_executor(self.executor, self.vectorstore_service.add, documents)
			else:
				result = await self.vectorstore_service.add(documents)
			logging.debug(f"Upserted {len(documents)} documents to vectorstore_service")
			return result
		except Exception as e:
			logging.error(f"Failed to upsert documents: {e}")
			return None

	##############################################################
	### Upsert Documents In Batches
	##############################################################
	async def upsert_in_batches(self, documents: List[Document], task_id: str = None):
		# Split documents into batches
		batches = [documents[i:i+self.batch_size] for i in range(0, len(documents), self.batch_size)]
		total_batches = len(batches)
		
		if cache:
			await cache.publish(
				task_id, 
				ujson.dumps({
					'step': 'upsert',
					'message': f'Creating {total_batches} batches of {self.batch_size} documents',
					'progress': 0, 
					'batch_number': 0,
					'batch_count': 0,
					'batch_size': 0
				})
			)

		results = []
		
		# Process each batch
		for i, batch in enumerate(batches):
			result = await self.upsert_documents(batch)
			results.append(result)
			
			if cache:
				await cache.publish(
					task_id, 
					ujson.dumps({
						'step': 'upsert',
						'message': f'Processed batch {i+1} of {total_batches}',
						'progress': round(((i+1) / total_batches) * 100, 2),
						'batch_number': i + 1,
						'batch_count': total_batches,
						'batch_size': len(batch)
					})
				)
		
		return results

	##############################################################
	### Upsert Documents In Parallel
	##############################################################
	async def upsert_in_parallel_batches(self, documents: List[Document]):
		# Split documents into batches
		batches = [documents[i:i+self.batch_size] for i in range(0, len(documents), self.batch_size)]
		
		# Create a list of future tasks for each batch
		tasks = [self.upsert_documents(batch) for batch in batches]
		
		logging.debug(f"Created {len(tasks)} tasks for upserting documents")

		# Run tasks concurrently and wait for all of them to complete
		results = await asyncio.gather(*tasks)
		
		logging.debug(f"Completed upserting all document batches")
		
		# Process results if needed
		return results