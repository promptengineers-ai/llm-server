
from langchain_community.document_loaders.text import TextLoader
from langchain_community.document_loaders.web_base import WebBaseLoader
from langchain_community.document_loaders.pdf import PyPDFLoader
from langchain_community.vectorstores.faiss import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents.base import Document
from langchain_text_splitters import CharacterTextSplitter

from src.models import SearchProvider
from src.config import OPENAI_API_KEY

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