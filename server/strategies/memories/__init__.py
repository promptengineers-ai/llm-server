from abc import ABC, abstractmethod

from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.memory import VectorStoreRetrieverMemory
from langchain.docstore import InMemoryDocstore
from langchain.vectorstores import FAISS

# Define the strategy interface
class MemoryStrategy(ABC):
	@abstractmethod
	def history(
		self,
		messages: list,
	):
		pass

class VectorstoreMemoryStrategy(MemoryStrategy):
	def __init__(self, embedding_size: int = 1536):
		self.embedding_size = embedding_size # Dimensions of the OpenAIEmbeddings

	def history(
		self,
		messages: list,
	) -> str:
		import faiss
		index = faiss.IndexFlatL2(self.embedding_size)
		embedding_fn = OpenAIEmbeddings().embed_query
		vectorstore = FAISS(embedding_fn, index, InMemoryDocstore({}), {})
		retriever = vectorstore.as_retriever(search_kwargs=dict(k=5))
		memory = VectorStoreRetrieverMemory(retriever=retriever)
		for message in messages:
			if message[0] and message[1]:
				memory.save_context({"input": message[0]}, {"output": message[1]})
		return memory

class MemoryContext:
	def __init__(self, strategy: MemoryStrategy):
		self.strategy = strategy

	def history(
		self,
		messages: list,
	) -> str:
		return self.strategy.history(messages)