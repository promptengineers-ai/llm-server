import unittest

from src.services.db import get_db
from src.repositories.chat import ChatRepository

class TestChatRepository(unittest.IsolatedAsyncioTestCase):
    
    async def asyncSetUp(self):
        await super().asyncSetUp()
        self.db_gen = get_db()  # Get the generator
        self.db = await self.db_gen.__anext__()  # Manually advance to the next item
        self.chat_repo = ChatRepository(db=self.db)
        self.user_id = 1
        self.chat_data = {
            "messages": [
                {"role": "user", "content": "Who won the 2001 world series?"},
                {"role": "assistant", "content": "The Arizona Diamondbacks won the 2001 World Series against the New Your Yankees."},
                {"role": "user", "content": "Who were the pitchers?"}
            ]
        }
        self.chat = await self.chat_repo.create(self.user_id, self.chat_data)

    async def asyncTearDown(self):
        if self.db.in_transaction():
            await self.db.rollback()
        await self.db.close()
        await self.chat_repo.delete(self.chat.get("id"))
        await super().asyncTearDown()

    async def test_list(self):
        # Test the list function
        chats = await self.chat_repo.list(user_id=1)
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
        update_result = await self.chat_repo.update(chat_id, new_message)
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