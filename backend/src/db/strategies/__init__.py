# import pickle
from abc import ABC, abstractmethod
# from io import BytesIO

from src.db import PineconeDB, RedisDB, PGVectorDB


# Define the strategy interface
class VectorStoreStrategy(ABC):
    @abstractmethod
    def add(self, loaders, chunk_size: int = 1000, chunk_overlap: int = 100):
        pass

    @abstractmethod
    def load(self):
        pass
    
    @abstractmethod
    def aload(self):
        pass
    
    @abstractmethod
    def delete(self):
        pass

#########################################################################
## FAISS Strategy
#########################################################################
# class FaissStrategy(VectorstoreStrategy):
#     def __init__(self, _s3_access_key, _s3_secret_key, bucket_name, path):
#         self.s3_access_key = _s3_access_key
#         self.s3_secret_key = _s3_secret_key
#         self.bucket_name = bucket_name
#         self.path = path

#     def load(self):
#         f = BucketService(
#             self.s3_access_key,
#             self.s3_secret_key
#         ).retrieve_file(
#             bucket=self.bucket_name,
#             path=self.path
#         )
#         with BytesIO(f.read()) as file:
#             vectorstore = pickle.load(file)
#         return vectorstore

#########################################################################
## Pinecone Strategy
#########################################################################
class PineconeStrategy(VectorStoreStrategy):
    def __init__(
        self,
        api_key: str,
        env: str,
        namespace: str,
        index_name: str,
        embeddings = None,
    ):
        self.api_key = api_key
        self.env = env
        self.namespace = namespace
        self.index_name = index_name
        self.embeddings = embeddings
        self.service = PineconeDB(
			api_key=self.api_key,
			env=self.env,
			index_name=self.index_name,
		)

    def list(self):
        return self.service.describe_index_stats()

    def add(self, documents):
        return self.service.from_documents(
            documents=documents,
            embeddings=self.embeddings,
            namespace=self.namespace
        )

    def load(self):
        return self.service.from_existing(
            embeddings=self.embeddings,
            namespace=self.namespace
        )
        
    async def aload(self):
        pass
        
    def delete(self):
        return self.service.delete()
        
#########################################################################
## Postgres Strategy
#########################################################################
class PostgresStrategy(VectorStoreStrategy):
    def __init__(
        self,
        connection: str,
        collection_name: str,
        embeddings = None,
        async_mode = False,
    ):
        self.connection = connection
        self.collection_name = collection_name
        self.embeddings = embeddings,
        self.service = PGVectorDB(
			connection=self.connection,
			collection_name=self.collection_name,
            embeddings=self.embeddings,
            async_mode=async_mode
		)

    def add(self, documents):
        return self.service.add_docs(documents)

    def load(self):
        return self.service.from_existing()
    
    def aload(self):
        return self.service.afrom_existing()
    
    def delete(self):
        return self.service.delete()

#########################################################################
## Redis Strategy
#########################################################################
class RedisStrategy(VectorStoreStrategy):
    def __init__(
        self,
        redis_url: str,
        index_name: str,
        index_schema: dict = {"page_content": "TEXT", "metadata": "HASH"},
        embeddings = None,
    ):
        self.redis_url = redis_url
        self.index_name = index_name
        self.index_schema = index_schema
        self.embeddings = embeddings,
        self.service = RedisDB(
			redis_url=self.redis_url,
			index_name=self.index_name,
            embeddings=self.embeddings
		)

    def list(self):
        return self.service.list_indexes()

    def add(self, documents):
        return self.service.add_docs(documents)

    def load(self):
        return self.service.from_existing(
            schema=self.index_schema
        )
        
    async def aload(self):
        pass
        
    def delete(self):
        return self.service.delete(self.index_name)

#########################################################################
## Strategy Context
#########################################################################
class VectorstoreContext:
    def __init__(self, strategy: VectorStoreStrategy):
        self.strategy = strategy

    def set_strategy(self, strategy: VectorStoreStrategy):
        self.strategy = strategy

    async def add(self, documents):
        return self.strategy.add(documents)
    
    def add_sync(self, documents):
        return self.strategy.add(documents)

    def load(self):
        return self.strategy.load()
    
    def aload(self):
        return self.strategy.aload()

    def delete(self):
        return self.strategy.delete()