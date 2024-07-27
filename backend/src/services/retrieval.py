
from typing import Optional
from langchain_community.document_loaders.text import TextLoader
from langchain_community.document_loaders.web_base import WebBaseLoader
from langchain_community.document_loaders.pdf import PyPDFLoader
from langchain_community.vectorstores.faiss import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents.base import Document
from langchain_core.embeddings import Embeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain.retrievers.document_compressors.base import DocumentCompressorPipeline
from langchain.retrievers import (
	ContextualCompressionRetriever,
	MergerRetriever,
)
from langchain_community.document_transformers import (
	EmbeddingsClusteringFilter,
	EmbeddingsRedundantFilter,
)
from langchain_community.document_transformers import LongContextReorder
from langchain_core.vectorstores import VectorStoreRetriever

from src.db.strategies import VectorstoreContext
from src.factories.retrieval import RetrievalFactory
from src.models import Agent, RetrievalParams, SearchProvider
from src.config import OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_ENV, PINECONE_INDEX, POSTGRES_URL, REDIS_URL

class RetrievalService:
	def __init__(self):
		pass

	def load(self, loader_type: str, args: dict):
		if loader_type == 'txt':
			loader = TextLoader(args['path'])
		elif loader_type == 'web':
			loader = WebBaseLoader(args['url'])
		elif loader_type == 'pdf':
			loader = PyPDFLoader(args['path'])
		else:
			loader = None
		documents = loader.load()
		return documents
	
	def split(
		self, 
		documents: list[Document], 
		splitter_type: str = 'char', 
		chunk_size: int = 1000, 
		chunk_overlap: int = 0
	):
		if splitter_type == 'char':
			splitter = CharacterTextSplitter(
				chunk_size=chunk_size,
				chunk_overlap=chunk_overlap
			)
		else:
			splitter = None
			
		texts = splitter.split_documents(documents)
		return texts
	
	def db(
		self, 
		provider: SearchProvider, 
		texts: list[Document], 
		embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
	):
		if provider == SearchProvider.FAISS:
			db = FAISS.from_documents(texts, embeddings)
		else:
			db = None
		return db
	
	def construct_retriever(
		self,
		config: dict,
		embeddings: Embeddings,
		retrieval: RetrievalParams
	) -> VectorStoreRetriever:
		retrieval_provider = RetrievalFactory(
			provider=retrieval.provider,
			embeddings=embeddings,
			provider_keys=config
		)
		vectostore_service = VectorstoreContext(retrieval_provider.create_strategy())
		vectorstore = vectostore_service.load()
		filter_search_kwargs = retrieval.search_kwargs.model_dump()
		return vectorstore.as_retriever(
			search_type=retrieval.search_type, 
			search_kwargs={k: v for k, v in filter_search_kwargs.items() if v is not None}
		)
		
	def config(self, provider: SearchProvider, index: str):
		if provider == SearchProvider.REDIS:
			return {
				'redis_url': REDIS_URL,
				'index_name': index,
			}
		elif provider == SearchProvider.PINECONE:
			return {
				'api_key': PINECONE_API_KEY,
				'env': PINECONE_ENV,
				'index_name': PINECONE_INDEX,
				'namespace': index,
			}
		elif provider == SearchProvider.POSTGRES:
			return {
				'connection': POSTGRES_URL,
				'collection_name': index,
				'async_mode': True,
			}
		else:
			raise ValueError(f"Invalid retrieval provider {provider}")

	def format_index_name(self, index_name: str, user_id = None):
		return f"{user_id}::{index_name}" if user_id else index_name

	def merge_retrievers(
		self, 
		retrievers: list, 
		embeddings: Embeddings
	) -> list[VectorStoreRetriever]:
		lotr = MergerRetriever(retrievers=retrievers)
		## Remove Redundant and Reorder
		filter = EmbeddingsRedundantFilter(embeddings=embeddings)
		reordering = LongContextReorder()
		pipeline = DocumentCompressorPipeline(transformers=[filter, reordering])
		compression_retriever_reordered = ContextualCompressionRetriever(
			base_compressor=pipeline, base_retriever=lotr
		)
		return compression_retriever_reordered

	def retriever(
		self, 
		retrieval: RetrievalParams, 
		embedding: Embeddings, 
		user_id: Optional[str] = None
    ):
		if len(retrieval.indexes) > 1:
			retrievers = []
			retrieval.search_kwargs.k = int(retrieval.search_kwargs.k / 2)
			for index in retrieval.indexes:				
				config = self.config(
					provider=retrieval.provider,
					index=self.format_index_name(
         				index, 
             			user_id
            		),
				)
				retriever = self.construct_retriever(
					config=config,
					embeddings=embedding.create_embedding(),
					retrieval=retrieval
				)
				retrievers.append(retriever)
			return self.merge_retrievers(
       			retrievers=retrievers, 
	   			embeddings=embedding.create_embedding()
          	)
		else:
			config = self.config(
				provider=retrieval.provider,
				index=self.format_index_name(
        			retrieval.indexes[0], 
           			user_id
              	),
			)
			return self.construct_retriever(
				config=config,
				embeddings=embedding.create_embedding(),
				retrieval=retrieval
			)