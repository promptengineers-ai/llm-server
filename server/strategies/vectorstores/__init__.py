# import pickle
from abc import ABC, abstractmethod
# from io import BytesIO

from langchain.embeddings.openai import OpenAIEmbeddings

from server.services.pinecone import PineconeService
from server.services.redis import RedisService


# Define the strategy interface
class VectorstoreStrategy(ABC):
    @abstractmethod
    def load(self):
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
class PineconeStrategy(VectorstoreStrategy):
    def __init__(
        self,
        openai_api_key: str,
        api_key: str,
        env: str,
        namespace: str,
        index_name: str,
    ):
        self.api_key = api_key
        self.openai_api_key = openai_api_key
        self.env = env
        self.namespace = namespace
        self.index_name = index_name

    def load(self):
        embeddings = OpenAIEmbeddings(openai_api_key=self.openai_api_key)
        pinecone_service = PineconeService(
			api_key=self.api_key,
			env=self.env,
			index_name=self.index_name,
		)
        return pinecone_service.from_existing(
            embeddings,
            namespace=self.namespace
        )

#########################################################################
## Pinecone Strategy
#########################################################################
class RedisStrategy(VectorstoreStrategy):
    def __init__(
        self,
        openai_api_key: str,
        redis_url: str,
        index_name: str,
        index_schema: dict = None,
    ):
        self.redis_url = redis_url
        self.openai_api_key = openai_api_key
        self.index_name = index_name
        self.index_schema = index_schema

    def load(self):
        redis_service = RedisService(
			redis_url=self.redis_url,
			index_name=self.index_name,
			openai_api_key=self.openai_api_key,
		)
        return redis_service.from_existing(
            schema=self.index_schema
        )

#########################################################################
## Strategy Context
#########################################################################
class VectorstoreContext:
    def __init__(self, strategy: VectorstoreStrategy):
        self.strategy = strategy

    def set_strategy(self, strategy: VectorstoreStrategy):
        self.strategy = strategy

    def load(self):
        return self.strategy.load()
