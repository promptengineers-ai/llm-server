
from langchain.callbacks import get_openai_callback
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter, RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS

from server.utils import logger

def split_docs(
    documents,
    chunk_size: int = 1000,
    chunk_overlap: int = 0,
    recursive: bool = True,
):
    ## Text Spliter
    if recursive:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
    else:
        text_splitter = CharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
    docs = text_splitter.split_documents(documents)
    return docs

def create_faiss_vectorstore(
    docs,
    chunk_size: int = 1000,
    chunk_overlap: int = 0
):
    """Load the vectorstore."""
    with get_openai_callback() as callback:
        logger.info('[loader_service.create_vectorstore] Tokens: %s', callback.total_tokens)
        embeddings = OpenAIEmbeddings(max_retries=2)
        return FAISS.from_documents(
            split_docs(docs, chunk_size, chunk_overlap),
            embeddings
        )
