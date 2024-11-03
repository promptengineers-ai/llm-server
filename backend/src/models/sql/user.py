import uuid

from sqlalchemy import Column, Integer, String
from src.models.sql import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    salt = Column(String, unique=True)
    oauth_provider = Column(String(50))
    access = Column(Integer, default=0)
    
    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "username": self.username,
            "oauth_provider": self.oauth_provider,
            "access": self.access,
            # Exclude password and salt from the output for security reasons
        }
