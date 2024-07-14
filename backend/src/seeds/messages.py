import asyncio
import sys
import datetime
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from sqlalchemy import desc

from src.models.sql.chat import Message, Chat
from src.config import DATABASE_URL, database_engine

# Initialize Faker
fake = Faker()

# Create an async engine and session
engine = create_async_engine(DATABASE_URL, echo=True, connect_args={"statement_cache_size": 0} if database_engine() == 'postgresql' else {})
async_session = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

async def seed_messages(num_messages_per_chat):
    async with async_session() as session:
        # Fetch the last 3 chats by created_at timestamp or by ID if created_at is not available
        chats = await session.execute(
            select(Chat).order_by(desc(Chat.created_at)).limit(3)
        )
        chats = chats.scalars().all()

        # Check if any chats are found
        if not chats:
            print("No chats found in the database.")
            return

        now = datetime.datetime.now()
        messages = []
        for chat in chats:
            last_role = 'assistant'  # Start with 'assistant' so the first one will be 'user'
            for _ in range(num_messages_per_chat):
                current_role = 'user' if last_role == 'assistant' else 'assistant'
                now = datetime.datetime.now()  # Get current timestamp
                message_data = {
                    'role': current_role,
                    'content': fake.sentence(),
                    'chat_id': chat.id,
                    'created_at': now,
                    'updated_at': now,
                }
                messages.append(Message(**message_data))
                last_role = current_role

        session.add_all(messages)
        await session.commit()
        print(f"Added {num_messages_per_chat * len(chats)} messages across {len(chats)} chats.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python -m src.seeds.messages <number_of_messages_per_chat>")
        sys.exit(1)
    
    num_messages_per_chat = int(sys.argv[1])
    asyncio.run(seed_messages(num_messages_per_chat))
