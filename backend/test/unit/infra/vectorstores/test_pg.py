"""test example module."""
import asyncio
import unittest

from src.config import retrieve_defaults
from src.config.llm import ModelType
from src.db.strategies import VectorstoreContext
from src.factories.embedding import EmbeddingFactory
from src.factories.retrieval import RetrievalFactory
from src.models import UpsertDocuments
from src.services.document import DocumentService
from src.services.db import create_default_user, get_db
from test import apply_migrations, cleanup_database
from langchain.retrievers.document_compressors.base import DocumentCompressorPipeline
from langchain.retrievers import (
    ContextualCompressionRetriever,
    MergerRetriever,
)
from langchain_community.document_transformers import (
    EmbeddingsClusteringFilter,
    EmbeddingsRedundantFilter,
)
from langchain_community.document_transformers import LongContextReorder

DOCS_1 = [
    {'page_content': 'The Big Bad Wolf is a character in fairy tales who is known for his cunning nature.', 'metadata': {'id': 1, 'location': 'fairy tales', 'topic': 'Big Bad Wolf'}},
    {'page_content': 'The Big Bad Wolf tried to blow down the houses of the Three Little Pigs.', 'metadata': {'id': 2, 'location': 'Three Little Pigs', 'topic': 'Big Bad Wolf'}},
    {'page_content': 'In some stories, the Big Bad Wolf disguises himself to trick others.', 'metadata': {'id': 3, 'location': 'various', 'topic': 'Big Bad Wolf'}},
]
DOCS_2 = [
    {'page_content': 'The Boy Who Cried Wolf is a fable about a boy who falsely alarms the villagers.', 'metadata': {'id': 4, 'location': 'fables', 'topic': 'Boy Who Cried Wolf'}},
    {'page_content': 'In the fable, the boy calls for help, claiming a wolf is attacking his sheep.', 'metadata': {'id': 5, 'location': 'pasture', 'topic': 'Boy Who Cried Wolf'}},
    {'page_content': 'The villagers stop believing the boy after multiple false alarms about a wolf.', 'metadata': {'id': 6, 'location': 'village', 'topic': 'Boy Who Cried Wolf'}},
]

class TestRedisVectorStore(unittest.IsolatedAsyncioTestCase):
        
    @classmethod
    def setUpClass(cls):
        # Run migrations before any tests
        asyncio.run(apply_migrations())

        # Initialize database and create default user
        cls.db_gen = get_db()
        cls.db = asyncio.run(cls.db_gen.__anext__())
        default_user = asyncio.run(create_default_user(cls.db))
        cls.user_id = default_user.id

    @classmethod
    def tearDownClass(cls):
        asyncio.run(cleanup_database())
    
    async def asyncSetUp(self):
        await super().asyncSetUp()
        self.db_gen = get_db()  # Get the generator
        self.db = await self.db_gen.__anext__()  # Manually advance to the next item
        self.keys = {'POSTGRES_URL'}
        self.tokens = retrieve_defaults(self.keys)
        self.body = {
            'task_id': 'test',
            'provider': 'postgres',
            'index_name': 'my_docs',
            'embedding': ModelType.OPENAI_TEXT_EMBED_3_SMALL.value,
            'documents': DOCS_1,
        }
        
    def get_index_name(self, index_name=None):
        return f"{self.user_id}::{index_name}"
    
    def get_embedding(self):
        embedding = EmbeddingFactory(llm=self.body.get('embedding'))
        return embedding.create_embedding()

    async def upsert_documents(self):
        document_service = DocumentService()
        result = await document_service.upsert(
            UpsertDocuments(**self.body), 
            self.tokens, 
            self.keys,
            self.user_id  # Access class attribute
        )
        assert len(result) > 0
        
    async def create_multiple_indexes(self, index_name=None, documents=[]):
        document_service = DocumentService()
        result = await document_service.upsert(
            UpsertDocuments(
                index_name=self.get_index_name(index_name),
                documents=documents,
                task_id=self.body.get('task_id'),
                provider=self.body.get('provider'),
                embedding=self.body.get('embedding'),
            ), 
            self.tokens, 
            self.keys,
            self.user_id  # Access class attribute
        )
        assert len(result) > 0
        
    async def retrieve_documents(self):
        retrieval_provider = RetrievalFactory(
            provider=self.body.get('provider'),
            embeddings=self.get_embedding(),
            provider_keys={
                'connection': self.tokens[next(iter(self.keys))],
                'collection_name': self.get_index_name(self.body.get('index_name')),
            }
        )
        vectostore_service = VectorstoreContext(retrieval_provider.create_strategy())
        vectorstore = vectostore_service.load()
        results = vectorstore.similarity_search('wolf', k=10)
        assert len(results) > 0
        
    
    def get_retriever(self, index_name=None, k=1, search_type='mmr'):
        retrieval_provider = RetrievalFactory(
            provider=self.body.get('provider'),
            embeddings=self.get_embedding(),
            provider_keys={
                'connection': self.tokens[next(iter(self.keys))],
                'collection_name': self.get_index_name(index_name),
            }
        )
        vectostore_service = VectorstoreContext(retrieval_provider.create_strategy())
        vectorstore = vectostore_service.load()
        return vectorstore.as_retriever(k=k, search_type=search_type)

        
    async def delete_collection(self):
        retrieval_provider = RetrievalFactory(
            provider=self.body.get('provider'),
            embeddings=self.get_embedding(),
            provider_keys={
                'connection': self.tokens[next(iter(self.keys))],
                'collection_name': self.get_index_name(self.body.get('index_name')),
            }
        )
        vectostore_service = VectorstoreContext(retrieval_provider.create_strategy())
        dropped = vectostore_service.delete()
        assert dropped == True

    @unittest.skip("skip test_upsert_and_retrieve_documents. Will not run in GH Action without Postgres container")
    async def test_upsert_and_retrieve_documents(self):
        await self.upsert_documents()
        await self.retrieve_documents()
        await self.delete_collection()
        
    # @unittest.skip("skip test_upsert_and_retrieve_documents. Will not run in GH Action without Postgres container")
    async def test_upsert_and_multi_retriever_(self):
        indexes = [['big-bad-wolf',DOCS_1], ['boy-who-cried-wolf', DOCS_2]]
        for index in indexes:
            await self.create_multiple_indexes(documents=index[1], index_name=index[0])
            
        retrievers = [self.get_retriever(index[0]) for index in indexes]    
        lotr = MergerRetriever(retrievers=retrievers)
        
        ## Remove Redundant and Reorder
        filter = EmbeddingsRedundantFilter(embeddings=self.get_embedding())
        reordering = LongContextReorder()
        pipeline = DocumentCompressorPipeline(transformers=[filter, reordering])
        compression_retriever_reordered = ContextualCompressionRetriever(
            base_compressor=pipeline, base_retriever=lotr
        )
        print(compression_retriever_reordered)