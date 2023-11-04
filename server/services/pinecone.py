"""Service for removing PII from text."""
from typing import List

import pinecone

from langchain.vectorstores import Pinecone

from server.utils.vectorstores import split_docs

class PineconeService:
    def __init__(self, api_key: str, env: str, index_name: str):
        self.api_key = api_key
        self.env = env
        self.index_name = index_name


    def client(self):
        pinecone.init(api_key=self.api_key, environment=self.env or 'us-east1-gcp')
        return pinecone


    #############################################################
    ## List Indexes
    #############################################################
    def list_indexes(self):
        return self.client().list_indexes()


    #############################################################
    ## Create or Get Index
    #############################################################
    def index(
		self,
		metric: str = 'cosine',
		dimension: int = 1536
	):
        if self.index_name not in self.client().list_indexes():
			# we create a new index
            self.client().create_index(
				name=self.index_name,
				metric=metric,
				dimension=dimension
			)
        return self.client().Index(index_name=self.index_name)



    #############################################################
    ## Describe Index Stats
    #############################################################
    def describe_index_stats(self):
        return self.index().describe_index_stats()


    #############################################################
    ## Delete Vectors
    #############################################################
    def delete(
		self,
		namespace: str,
		ids: List[str] = None,
	):
        if self.index_name in self.client().list_indexes():
            delete_all = True if not ids else False
            deleted = self.index().delete(
                ids=ids,
                delete_all=delete_all,
                namespace=namespace
            )
            return deleted
        else:
            return False


    #############################################################
    ## Create Vectorstore from Documents
    #############################################################
    def from_existing(
		self,
		embeddings,
		namespace: str,
	):
        self.client()
        return Pinecone.from_existing_index(
            index_name=self.index_name,
            embedding=embeddings,
            namespace=namespace
        )


    #############################################################
    ## Create Vectorstore from Documents
    #############################################################
    def from_documents(
		self,
		loaders,
		embeddings,
		namespace: str,
		chunk_size: int = 1000,
		chunk_overlap: int = 100,
	):
        docs = []
        for loader in loaders:
            docs.extend(loader.load())
        self.client()
        return Pinecone.from_documents(
            split_docs(docs, chunk_size, chunk_overlap),
            embeddings,
            index_name=self.index_name,
            namespace=namespace
        )

