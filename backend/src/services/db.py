from src.infrastructure.logger import logger as logging
import sqlalchemy
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from src.config import APP_ADMIN_EMAIL, APP_ADMIN_PASS, APP_SECRET, DATABASE_URL, database_engine
from src.models.sql.user import User 


def configure_engine(db_url: str = None):
    return create_async_engine(
        db_url or DATABASE_URL, 
        echo=True, 
        connect_args={"statement_cache_size": 0} if database_engine() == 'postgresql' and not db_url else {}
    )

async def create_default_user(session):
    default_user = await session.execute(
        sqlalchemy.select(User).filter_by(username="admin")
    )
    default_user = default_user.scalars().first()
    
    if not APP_SECRET:
        raise ValueError("env variable APP_SECRET is not set")
    
    if not default_user:
        user = User(full_name="Admin User", 
                    username="admin", 
                    email=APP_ADMIN_EMAIL, 
                    password=APP_ADMIN_PASS, 
                    salt=APP_SECRET)
        session.add(user)
        try:
            await session.commit()
            await session.refresh(user)
        except sqlalchemy.exc.IntegrityError as e:
            logging.exception(e)
            await session.rollback()
            
        return user
    
    await session.close()
    return default_user

async def get_db():
    AsyncSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=configure_engine(DATABASE_URL),
        class_=AsyncSession
    )
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()


async def get_vector_db(url: str = None):
    """Found out that if argument was used in get_db it would show the argumment in swagger whereever
    get_db was used with Depends. THIS IS NO GOOD. So I created a new function get_vector_db"""
    AsyncSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=configure_engine(url or DATABASE_URL),
        class_=AsyncSession
    )
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()