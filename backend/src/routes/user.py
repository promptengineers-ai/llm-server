from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from fastapi import APIRouter, Depends, Body, HTTPException, status, Request
from fastapi.responses import UJSONResponse
from sqlalchemy.future import select
from pydantic import BaseModel, Field

from src.config import default_app_tokens
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
    # Check for existing user with the same email or username
    existing_user = await db.execute(select(User).where((User.email == user.email) | (User.username == user.username)))
    existing_user = existing_user.scalars().first()
    
    if existing_user:
        raise HTTPException(status_code=409, detail="User with this email or username already exists")
    
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



class ResponseApiKeys(BaseModel):
    keys: Any = Field(...)

    __config__ = {
		"json_schema_extra": {
            "example": {
                "PINECONE_ENV": "us-east1-gcp",
                "S3_BUCKET_NAME": "prompt-engineers-dev",
                "OPENAI_API_KEY": "...",
                "PROMPTLAYER_API_KEY": "...",
                "PINECONE_INDEX": "default",
                "AWS_ACCESS_KEY_ID": "...",
                "AWS_SECRET_ACCESS_KEY": "...",
                "MONGO_CONNECTION": "mongodb+srv://dev:password@cluster0.dyrt8.mongodb.net",
                "SLACK_USER_TOKEN": "...",
                "SLACK_BOT_TOKEN": "...",
                "GOOGLE_APPLICATION_CREDENTIALS": "...",
                "CRONITOR_API_KEY": "...",
                "PINECONE_API_KEY": "...",
                "MONGO_DB_NAME": "chat_history",
                "GH_TOKEN": "...",
                "NOTION_API_KEY": "...",
                "GITLAB_TOKEN": "..."
            }
        }
    }

@router.get(
	"/tokens",
	tags=[TAG], 
    dependencies=[Depends(current_user)],
	response_model=ResponseApiKeys,
)
async def get_environment_variables(
	request: Request,
	exists: str = None  # Optional query parameter as a comma-separated string
):
	try:

		# if exists:
			# If keys query parameter is provided, check for their existence
			data_map = {'keys': default_app_tokens}
			keys_to_check = exists.split(',') if exists else []
			keys_existence = {key: key in data_map for key in keys_to_check}

			return UJSONResponse(
				content={'keys': keys_existence},
				media_type='application/json',
				status_code=200
			)

			# return UJSONResponse(
			# 	content={'keys': data_map},
			# 	media_type='application/json',
			# 	status_code=200
			# )
	except Exception:
		raise HTTPException(status_code=401, detail="Unauthorized")
