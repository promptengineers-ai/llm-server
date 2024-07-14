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
            'documents': [
                {'page_content': 'ducks are found in the river', 'metadata': {'id': 1, 'location': 'river', 'topic': 'animals'}},
                {'page_content': 'ducks are also found in the pond', 'metadata': {"id": 2, "location": "pond", "topic": "animals"}},
                {'page_content': 'fresh apples are available at the market', 'metadata': {"id": 3, "location": "market", "topic": "food"}},
            ],
        }
        self.index_name_or_namespace = f"{self.user_id}::{self.body.get('index_name')}"

    async def upsert_documents(self):
        document_service = DocumentService()
        result = await document_service.upsert(
            UpsertDocuments(**self.body), 
            self.tokens, 
            self.keys,
            self.user_id  # Access class attribute
        )
        assert len(result) > 0
        
    async def retrieve_documents(self):
        embedding = EmbeddingFactory(llm=self.body.get('embedding'))
        retrieval_provider = RetrievalFactory(
            provider=self.body.get('provider'),
            embeddings=embedding.create_embedding(),
            provider_keys={
                'connection': self.tokens[next(iter(self.keys))],
                'collection_name': self.index_name_or_namespace,
            }
        )
        vectostore_service = VectorstoreContext(retrieval_provider.create_strategy())
        vectorstore = vectostore_service.load()
        results = vectorstore.similarity_search('ducks', k=10)
        assert len(results) > 0
        
    async def delete_collection(self):
        embedding = EmbeddingFactory(llm=self.body.get('embedding'))
        retrieval_provider = RetrievalFactory(
            provider=self.body.get('provider'),
            embeddings=embedding.create_embedding(),
            provider_keys={
                'connection': self.tokens[next(iter(self.keys))],
                'collection_name': self.index_name_or_namespace,
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