"""Service for removing PII from text."""
from langchain_postgres import PGVector
from src.infrastructure.logger import logger as logging

class PGVectorDB:
	def __init__(
			self, 
			connection: str, 
			collection_name: str = None, 
			embeddings = None,
			async_mode = False,
	):
		self.connection = connection
		self.collection_name = collection_name
		self.embeddings = embeddings or None
		self.async_mode = async_mode
		self.client = PGVector(
			connection=self.connection,
			collection_name=self.collection_name,
			embeddings=self.embeddings[0] if self.embeddings else None,
			use_jsonb=True,
			async_mode=self.async_mode,
			logger=logging
		)

	def add_docs(self, documents: list):
		return self.client.add_documents(documents)


	def from_existing(self):
		return self.client.from_existing_index(
			collection_name=self.collection_name,
			embedding=self.embeddings[0],
			connection=self.connection,
			async_mode = self.async_mode
		)
  
	def afrom_existing(self):
		return self.client.afrom_existing_index(
			collection_name=self.collection_name,
			embedding=self.embeddings[0],
			connection=self.connection,
		)
  
	def delete(self):
		result = self.client.delete_collection()
		if not result:
			return True
		return False