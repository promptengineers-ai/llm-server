import os
import ujson

from alembic import command
from alembic.config import Config
from sqlalchemy.ext.asyncio import create_async_engine
from starlette.testclient import TestClient

from src.api import app
from src.config import DATABASE_URL, database_engine, database_type
from src.models.sql import Base

client = TestClient(app)

def disabled(f):
    def _decorator():
        print(f.__name__ + ' has been disabled')
    return _decorator

def get_test_token():
    data = {
        "email": "test@example.com",
        "password": "test1234"
    }
    headers = {
        "Content-Type": "application/json",
    }
    response = client.post("/auth/login", json=data, headers=headers)
    json_str = ujson.loads(response.content)
    return json_str['token']

async def apply_migrations():
    if database_engine() != 'sqlite':
            raise Exception("Database engine is not SQLite")
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    
async def drop_all_tables():
    if database_engine() != 'sqlite':
        return Exception("Database engine is not SQLite")
    engine = create_async_engine(
        DATABASE_URL, 
        connect_args=database_type('connect_args')
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        
async def cleanup_database():
    if database_engine() != 'sqlite':
            raise Exception("Database engine is not SQLite")
    await drop_all_tables()
    remove_database_file()
        
def remove_database_file():
    """Remove the SQLite database file."""
    db_path = DATABASE_URL.split("///")[-1]
    if os.path.exists(db_path):
        os.remove(db_path)