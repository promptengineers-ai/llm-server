import unittest
import asyncio

from src.config import retrieve_defaults
from src.repositories.index import IndexRepository
from src.services.db import get_vector_db
from test import apply_migrations, cleanup_database

class TestIndexRepository(unittest.IsolatedAsyncioTestCase):
    
    @classmethod
    def setUpClass(cls):
        # Run migrations before any tests
        asyncio.run(apply_migrations())

    @classmethod
    def tearDownClass(cls):
        asyncio.run(cleanup_database())
        
    async def asyncSetUp(self):
        await super().asyncSetUp()
        self.user_id = '6a52b9d3-b08c-4075-80e3-665a061311d0'
        self.tokens = retrieve_defaults({'POSTGRES_URL'})
        self.db_gen = get_vector_db(self.tokens.get('POSTGRES_URL'))
        self.db = await self.db_gen.__anext__()
        self.repo = IndexRepository(db=self.db, user_id=self.user_id)

    async def test_list(self):
        # Test the list function
        items = await self.repo.list()
        self.assertIsInstance(items, list)  # Expecting a list
        if items:
            self.assertIsInstance(items[0], dict)
    
    @unittest.skip("skip test_update_name. requires manual intervention")
    async def test_update_name(self):
        # Update the name
        old = 'big-bad-wolf'
        new = 'three-little-pigs'
        await self.repo.update_name(old, new)
        
        # Verify the update
        items = await self.repo.list()
        names = [item['name'] for item in items]
        self.assertIn(new, names)
        self.assertNotIn(old, names)
    
if __name__ == '__main__':
    unittest.main()
