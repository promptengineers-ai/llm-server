import unittest
import asyncio

from src.models import Agent as ChatBody
from src.services.db import create_default_user, get_db
from src.repositories.chat import ChatRepository
from test import apply_migrations, cleanup_database

class TestChatRepository(unittest.IsolatedAsyncioTestCase):
    
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
        
        self.chat_repo = ChatRepository(db=self.db, user_id=self.user_id)

        self.chat_data = {
            "system": "You are a helpful assistant.",
            "messages": [
                {"index": 1, "role": "user", "content": "Who won the 2001 world series?"},
                {"index": 2, "role": "assistant", "content": "The Arizona Diamondbacks won the 2001 World Series against the New Your Yankees."},
                {"index": 3, "role": "user", "content": "Who were the pitchers?"}
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
        
        # Verify that the messages are in the correct order by content
        expected_messages = self.chat_data["messages"]
        found_messages = found_chat['messages']
        self.assertEqual(len(expected_messages), len(found_messages), "Number of messages does not match")
        
        for expected_msg, found_msg in zip(expected_messages, found_messages):
            self.assertEqual(expected_msg['role'], found_msg['role'])
            self.assertEqual(expected_msg['content'], found_msg['content'])
            
    async def test_update(self):
        chat_id = self.chat.get("id")
        new_message = {
            "messages": [
                *self.chat_data["messages"],
                {"index": 4, "role": "assistant", "content": "Randy Johnson and Curt Schilling were the pitchers."}
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