import unittest
import asyncio

from src.models.tools import APITool
from src.repositories.tool import ToolRepository
from src.services.db import create_default_user, get_db
from test import apply_migrations, cleanup_database


class TestToolRepository(unittest.IsolatedAsyncioTestCase):
    
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
        self.repo = ToolRepository(db=self.db, user_id=self.user_id)
        self.mock_tool = APITool.__config__['json_schema_extra']['examples']['update_reqbody']
        self.created_tool = await self.repo.create(APITool(**self.mock_tool))
        
    async def asyncTearDown(self):
        if self.db.in_transaction():
            await self.db.rollback()
        await self.db.close()
        await self.repo.delete(self.created_tool.get("value"))
        await super().asyncTearDown()

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