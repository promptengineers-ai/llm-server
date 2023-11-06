"""Service for removing PII from text."""
import os
from langchain.vectorstores.redis import Redis
from langchain.embeddings.openai import OpenAIEmbeddings
from server.utils.vectorstores import split_docs

class RedisService:
	def __init__(self, redis_url: str, index_name: str, openai_api_key: str = None):
		self.redis_url = redis_url
		self.index_name = index_name
		self.embedding = OpenAIEmbeddings(openai_api_key=openai_api_key)
		self.client = Redis(
			redis_url=self.redis_url, 
			index_name=self.index_name, 
			embedding=self.embedding
		)

	def from_documents(
		self,
		loaders,
		chunk_size: int = 1000,
		chunk_overlap: int = 100,
	):
		docs = []
		for loader in loaders:
			docs.extend(loader.load())
		
		## TODO: Find out why this is needed, wouldn't work before without.
		os.environ['REDIS_URL'] = self.redis_url

		return self.client.from_documents(
			split_docs(docs, chunk_size, chunk_overlap),
			self.embedding,
			index_name=self.index_name
		)

	#############################################################
	## Retrieve Vectors from Existing Index
	#############################################################
	def from_existing(
		self,
		schema: dict = None,
	):
		## TODO: Find out why this is needed, wouldn't work before without.
		os.environ['REDIS_URL'] = self.redis_url
		return Redis.from_existing_index(
			index_name=self.index_name,
			embedding=self.embedding,
			schema=schema
		)
