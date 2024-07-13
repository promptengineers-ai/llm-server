"""Service for removing PII from text."""
from langchain_postgres import PGVector


class PGVectorDB:
	def __init__(
			self, 
			connection: str, 
			collection_name: str = None, 
			embeddings = None,
	):
		self.connection = connection
		self.collection_name = collection_name
		self.embeddings = embeddings or None
		self.client = PGVector(
			connection=self.connection,
			collection_name=self.collection_name,
			embeddings=self.embeddings[0] if self.embeddings else None,
			use_jsonb=True
		)

	def add_docs(self, documents: list):
		return self.client.add_documents(documents)
