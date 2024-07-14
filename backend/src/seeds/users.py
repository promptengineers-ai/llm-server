import asyncio
import sys
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from src.models.sql.user import User  # Ensure this path is correct
from src.utils.auth import hash_password  # Ensure this function exists and is correct
from src.config import DATABASE_URL, database_engine

# Initialize Faker
fake = Faker()

# Create an async engine and session
engine = create_async_engine(DATABASE_URL, echo=True, connect_args={"statement_cache_size": 0} if database_engine() == 'postgresql' else {})
async_session = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

async def seed_data(num_users):
    async with async_session() as session:
        users_info = [
            ("Ryan Doe", "ryan@test.com", "ryan"),
            ("James Smith", "james@test.com", "james"),
            ("Terry Jones", "terry@test.com", "terry")
        ]
        
        users = []
        for full_name, email, username in users_info:
            password, salt = hash_password('test1234')
            users.append(User(
                full_name=full_name,
                email=email,
                username=username,
                password=password,
                salt=salt
            ))

        session.add_all(users)
        await session.commit()
        print(f"Seeded {num_users} users.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python -m src.seeds.users <number_of_users>")
        sys.exit(1)
    
    num_users = int(sys.argv[1])
    asyncio.run(seed_data(num_users))
