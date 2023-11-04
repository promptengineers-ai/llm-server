from langchain.document_loaders.base import BaseLoader
from langchain.docstore.document import Document

class CopyPasteLoader(BaseLoader):
	def __init__(self, text):
		self.text = text

	def load(self):
		return [Document(page_content=self.text)]
