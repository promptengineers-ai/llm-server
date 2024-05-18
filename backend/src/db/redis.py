"""Service for removing PII from text."""
import os

from redis import Redis as RedisClient
from langchain.vectorstores.redis import Redis


class RedisDB:
	def __init__(
			self, 
			redis_url: str, 
			index_name: str = None, 
			embeddings = None,
	):
		self.redis_url = redis_url
		self.index_name = index_name
		self.embeddings = embeddings or None
		self.client = Redis(
			redis_url=self.redis_url,
			index_name=self.index_name,
			embedding=self.embeddings[0] if self.embeddings else None
		)

	def add_docs(self, documents: list):

		## TODO: Find out why this is needed, wouldn't work before without. 
  		## (using environ rather than passing)
		os.environ['REDIS_URL'] = self.redis_url

		return self.client.add_documents(documents)

	#############################################################
	## Retrieve Vectors from Existing Index
	#############################################################
	def from_existing(
		self,
		schema: dict = {"page_content": "TEXT", "metadata": "HASH"},
	):
		return self.client.from_existing_index(
			index_name=self.index_name,
			embedding=self.embeddings,
			redis_url=self.redis_url,
			schema=schema
		)

	#############################################################
	## List Vectorstores
	#############################################################
	def list_indexes(
		self
	):
		## TODO: Find out why this is needed, wouldn't work before without.
		redis_client = RedisClient.from_url(self.redis_url)
		indexes = redis_client.execute_command('FT._LIST')
		return [result.decode('utf-8') for result in indexes]

	#############################################################
	## Delete Vectors
	#############################################################
	def delete(
		self,
		index_name: str
	):
		os.environ['REDIS_URL'] = self.redis_url
		dropped = self.client.drop_index(index_name=index_name, delete_documents=True)
		if dropped:
			return True
		else:
			return False