"""test example module."""
import asyncio
import unittest

from src.config import retrieve_defaults
from src.config.llm import ModelType
from src.models import UpsertDocuments
from src.services.document import DocumentService
from src.services.db import create_default_user, get_db
from test import apply_migrations, cleanup_database

class TestRedisVectorStore(unittest.IsolatedAsyncioTestCase):
        
    @classmethod
    def setUpClass(cls):
        # Run migrations before any tests
        asyncio.run(apply_migrations())

    @classmethod
    def tearDownClass(cls):
        asyncio.run(cleanup_database())
    
    async def asyncSetUp(self):
        await super().asyncSetUp()
        self.db_gen = get_db()  # Get the generator
        self.db = await self.db_gen.__anext__()  # Manually advance to the next item
        default_user = await create_default_user(self.db)
        self.user_id = default_user.id
        self.keys = {'POSTGRES_URL'}
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
    
    @unittest.skip("skip test_upsert_documents. Will not run in GH Action without Postgres container")
    async def test_upsert_documents(self):
        tokens = retrieve_defaults(self.keys)
        document_service = DocumentService()
        result = await document_service.upsert(
            UpsertDocuments(**self.body), 
            tokens, 
            self.keys,
            self.user_id
        )
        assert len(result) > 0