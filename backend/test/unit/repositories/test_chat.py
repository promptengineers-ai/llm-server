import unittest
import asyncio
import os
from alembic import command
from alembic.config import Config
from sqlalchemy.ext.asyncio import create_async_engine

from src.config import DATABASE_URL
from src.models.sql import Base
from src.models import Agent as ChatBody
from src.services.db import create_default_user, get_db
from src.repositories.chat import ChatRepository

class TestChatRepository(unittest.IsolatedAsyncioTestCase):
    
    @classmethod
    def setUpClass(cls):
        # Run migrations before any tests
        asyncio.run(cls.apply_migrations())

    @classmethod
    async def apply_migrations(cls):
        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")

    @classmethod
    def tearDownClass(cls):
        asyncio.run(cls.cleanup_database())

    @classmethod
    async def cleanup_database(cls):
        await cls.drop_all_tables()
        cls.remove_database_file()
        
    @classmethod
    async def drop_all_tables(cls):
        engine = create_async_engine(DATABASE_URL)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)

    @classmethod
    def remove_database_file(cls):
        """Remove the SQLite database file."""
        db_path = DATABASE_URL.split("///")[-1]  # Assumes format 'sqlite+aiosqlite:///path_to_db'
        if os.path.exists(db_path):
            os.remove(db_path)
    
    async def asyncSetUp(self):
        await super().asyncSetUp()
        self.db_gen = get_db()  # Get the generator
        self.db = await self.db_gen.__anext__()  # Manually advance to the next item
        default_user = await create_default_user(self.db)
        self.user_id = default_user.id
        
        self.chat_repo = ChatRepository(db=self.db, user_id=self.user_id)

        self.chat_data = {
            "system": "You are a helpful assistant.",
            "messages": [
                {"role": "user", "content": "Who won the 2001 world series?"},
                {"role": "assistant", "content": "The Arizona Diamondbacks won the 2001 World Series against the New Your Yankees."},
                {"role": "user", "content": "Who were the pitchers?"}
            ],
            "tools": [],
            "retrieval": {
                "provider": "redis",
                "embedding": "openai-text-embedding-3-large",
                "index_name": "",
                "search_type": "mmr",
                "search_kwargs": {
                    "k": 20,
                    "fetch_k": None,
                    "score_threshold": None,
                    "lambda_mult": None,
                    "filter": None
                }
            }
        }
        self.chat = await self.chat_repo.create(ChatBody(**self.chat_data))

    async def asyncTearDown(self):
        if self.db.in_transaction():
            await self.db.rollback()
        await self.db.close()
        await self.chat_repo.delete(self.chat.get("id"))
        await super().asyncTearDown()

    async def test_list(self):
        # Test the list function
        chats = await self.chat_repo.list()
        print(f'Chat Count: {len(chats)}')
        self.assertIsInstance(chats, list)  # Expecting a list
        if chats:
            self.assertIsInstance(chats[0], dict)
            
    async def test_create(self):
        # Verify creation
        self.assertIsInstance(self.chat, dict)
        self.assertIn("id", self.chat)
        
    async def test_find(self):
        chat_id = self.chat.get("id")
        # Find the newly created chat
        found_chat = await self.chat_repo.find(chat_id)
        self.assertIsNotNone(found_chat)
        self.assertEqual(found_chat['id'], chat_id)
            
    async def test_update(self):
        chat_id = self.chat.get("id")
        new_message = {
            "messages": [
                *self.chat_data["messages"],
                {"role": "assistant", "content": "Randy Johnson and Curt Schilling were the pitchers."}
            ]
        }
        
        # Update the chat
        update_result = await self.chat_repo.update(chat_id, ChatBody(**new_message))
        self.assertIsNotNone(update_result)
        self.assertEqual(update_result["id"], chat_id)
        
    async def test_delete(self):
        chat_id = self.chat.get("id")
        # Delete the chat
        await self.chat_repo.delete(chat_id)
        # Verify deletion
        found_chat = await self.chat_repo.find(chat_id)
        self.assertIsNone(found_chat)
    
if __name__ == '__main__':
    unittest.main()