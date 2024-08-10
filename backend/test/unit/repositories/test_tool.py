import unittest
import asyncio

from src.models.tools import APITool
from src.repositories.tool import ToolRepository
from src.services.db import create_default_user, get_db
from test import apply_migrations, cleanup_database


class TestToolRepository(unittest.IsolatedAsyncioTestCase):
    
    @classmethod
    def setUpClass(cls):
        async def setup():
            # Run migrations
            await apply_migrations()
            cls.db_gen = get_db()
            cls.db = await cls.db_gen.__anext__() 
            # Create the default user
            default_user = await create_default_user(cls.db)
            cls.user_id = default_user.id
            cls.repo = ToolRepository(user_id=cls.user_id, db=cls.db)
            cls.mock_tool = APITool.__config__['json_schema_extra']['example']
            cls.created_tool = await cls.repo.create(APITool(**cls.mock_tool))
        asyncio.run(setup())    

    @classmethod
    def tearDownClass(cls):
        asyncio.run(cleanup_database())

    async def test_create(self):
        # Test the create function
        self.assertTrue(self.created_tool)
        
    async def test_list(self):
        # Test the list function
        items = await self.repo.list()
        self.assertGreater(len(items), 0)
        
    async def test_delete(self):
        # Test the delete function
        deleted = await self.repo.delete(self.mock_tool['name'])
        self.assertTrue(deleted)
    
if __name__ == '__main__':
    unittest.main()