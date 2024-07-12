import asyncio
import sys
import uuid
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

from src.config import DATABASE_URL, database_engine

# Initialize Faker
fake = Faker()

# Create an async engine and session
engine = create_async_engine(DATABASE_URL, echo=True, connect_args={"statement_cache_size": 0} if database_engine() == 'postgresql' else {})
async_session = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

async def seed_documents(num_documents):
    async with async_session() as session:
        # Use the text function to explicitly declare the SQL query
        query = text("SELECT id FROM messages ORDER BY created_at DESC LIMIT 5")
        result = await session.execute(query)
        message_ids = [row[0] for row in result.fetchall()]

        if not message_ids:
            print("No messages found.")
            return

        # Create and insert documents
        for message_id in message_ids:
            document_data = {
                'id': str(uuid.uuid4()),
                'message_id': message_id,
                'page_content': fake.sentence(nb_words=10),
                'document_metadata': {
                    'source': fake.url(),
                    'page_number': fake.random_int(min=1, max=10),
                    'section_number': fake.random_int(min=1, max=20),
                    'word_count': fake.random_int(min=100, max=200),
                    'character_count': fake.random_int(min=300, max=1000)
                }
            }
            # Insert document data into database, using a raw SQL command
            insert_query = text(
                "INSERT INTO documents (id, message_id, page_content, document_metadata) VALUES (:id, :message_id, :page_content, :document_metadata)"
            )
            await session.execute(
                insert_query,
                {
                    'id': document_data['id'], 
                    'message_id': message_id, 
                    'page_content': document_data['page_content'], 
                    'document_metadata': str(document_data['document_metadata'])
                }
            )

        await session.commit()
        print(f"Seeded {num_documents} documents.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python -m src.seeds.documents <number_of_documents>")
        sys.exit(1)
    
    num_documents = int(sys.argv[1])
    asyncio.run(seed_documents(num_documents))
