import asyncio
import sys
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select

from src.models.sql.user import User
from src.models.sql.chat import Chat, Message
from src.config import DATABASE_URL

# Initialize Faker
fake = Faker()

# Create an async engine and session
engine = create_async_engine(DATABASE_URL, echo=True, connect_args={"statement_cache_size": 0})
async_session = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

async def seed_chats(num_chats):
    async with async_session() as session:
        # Assume user records already exist and fetch user IDs
        result = await session.execute(
            select(User.id).limit(1)  # Fetching only 1 for the example
        )
        user_ids = result.scalars().all()

        chats = []
        for _ in range(num_chats):
            chat_data = {
                'user_id': 1,  # Using random_element
            }
            new_chat = Chat(**chat_data)
            # Assume each chat will have 1 message with 1 image
            chats.append(new_chat)

        session.add_all(chats)
        await session.commit()
        print(f"Seeded {num_chats} chats.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python -m src.seeds.chats <number_of_chats>")
        sys.exit(1)
    
    num_chats = int(sys.argv[1])
    asyncio.run(seed_chats(num_chats))
