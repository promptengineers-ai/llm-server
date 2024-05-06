"""Pinecone Service"""
from typing import List

from pinecone import Pinecone, PodSpec
from langchain_pinecone import PineconeVectorStore

from threading import Lock

class PineconeDB:
    _instance = None
    _lock = Lock()  # To ensure thread-safe singleton initialization

    def __new__(cls, api_key: str = None, env: str = None, index_name: str = None):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(PineconeDB, cls).__new__(cls)
                # Initialize Pinecone only once
                cls._instance.initialize(api_key, env, index_name)
            return cls._instance

    def initialize(self, api_key: str, env: str, index_name: str):
        if all([api_key, env, index_name]):
            self.api_key = api_key
            self.env = env
            self.index_name = index_name
            self.pinecone_client = Pinecone(api_key=api_key) 
            self.client_initialized = False
        else:
            raise ValueError("API Key, Environment, and Index Name are required for PineconeService initialization.")


    def client(self):
        if not self.client_initialized:
            self.client_initialized = True
        return self.pinecone_client

    # #############################################################
    # ## List Indexes
    # #############################################################
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
        # if self.index_name not in self.client().list_indexes():
		# 	# we create a new index
        #     self.client().create_index(
		# 		name=self.index_name,
		# 		metric=metric,
		# 		dimension=dimension,
        #         spec=PodSpec(
        #             environment=self.env,
        #             pod_type="s1.x1",
        #             pods=1
        #         )
		# 	)
        return self.client().Index(name=self.index_name)



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
        return PineconeVectorStore(
            pinecone_api_key=self.api_key, 
            embedding=embeddings, 
            index_name=self.index_name,
            namespace=namespace    
        ).from_existing_index(
            index_name=self.index_name,
            embedding=embeddings,
            namespace=namespace
        )


    #############################################################
    ## Create Vectorstore from Documents
    #############################################################
    def from_documents(
		self,
		documents,
		embeddings,
		namespace: str
	):
        return PineconeVectorStore(
            pinecone_api_key=self.api_key, 
            embedding=embeddings, 
            index_name=self.index_name,
            namespace=namespace
        ).from_documents(
            documents,
            embedding=embeddings,
            namespace=namespace,
            index_name=self.index_name
        )


