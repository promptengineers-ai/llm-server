from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from fastapi import APIRouter, Depends, Body, HTTPException, status, Request
from sqlalchemy.future import select

from src.services.db import get_db
from src.middleware.auth import current_user
from src.models.sql.user import User
from src.schemas.user import UserCreate, UserRead
from src.utils.auth import hash_password, verify_password, create_access_token

TAG = "Auth"
router = APIRouter()

@router.get("/auth/user", tags=[TAG], dependencies=[Depends(current_user)])
async def read_user_details(request: Request, db: AsyncSession = Depends(get_db)):
    # Retrieve user_id (assuming it's an email) from request state
    user_id = request.state.user_id

    # Query to select user data by email
    raw_sql = text("SELECT id, full_name, email, username FROM users WHERE id = :id")
    result = await db.execute(raw_sql, {"id": user_id})
    user = result.fetchone()  # Assuming email is unique and there should only be one result

    if user:
        return {"user": user._asdict()}
    else:
        return {"error": "User not found"}, 404

@router.post("/auth/register", tags=[TAG], response_model=UserRead)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Hash the password with salt and pepper
    password_hash, salt = hash_password(user.password)
    # Create a new user instance
    new_user = User(
        full_name=user.full_name, 
        email=user.email,
        username=user.username,
        password=password_hash,
        salt=salt
    )
    # Add the new user to the database
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/auth/login", tags=[TAG])
async def login_for_access_token(
    db: AsyncSession = Depends(get_db), 
    email: str = Body(...), 
    password: str = Body(...)
):
    user = (await db.execute(select(User).filter_by(email=email))).scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(password, user.password, user.salt):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email, "username": user.username})
    return {"access_token": access_token, "token_type": "bearer"}