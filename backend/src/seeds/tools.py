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

async def seed_tools(num_tools):
    print(f"Seeding {num_tools} tools...")    


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python -m src.seeds.tools <number_of_tools>")
        sys.exit(1)
    
    num_tools = int(sys.argv[1])
    asyncio.run(seed_tools(num_tools))
