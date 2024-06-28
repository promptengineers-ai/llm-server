import sqlalchemy
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from src.config import DATABASE_URL
from src.models.sql.user import User 

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession
)

async def create_default_user(session):
    default_user = await session.execute(
        sqlalchemy.select(User).filter_by(username="admin")
    )
    default_user = default_user.scalars().first()
    
    if not default_user:
        user = User(full_name="admin", username="admin", email="admin@example.com", password="password", salt='test1234')
        session.add(user)
        try:
            await session.commit()
            await session.refresh(user)
        except sqlalchemy.exc.IntegrityError as e:
            print(e)
            await session.rollback()
        return user
    
    await session.close()
    return default_user

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session