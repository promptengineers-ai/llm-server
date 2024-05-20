import uuid
from typing import ClassVar
from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    full_name: str
    email: str
    username: str
    password: str

class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    id: uuid.UUID
    Config: ClassVar[ConfigDict] = ConfigDict(arbitrary_types_allowed=True)
