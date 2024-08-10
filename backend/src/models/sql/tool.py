import datetime
import uuid
from sqlalchemy import Boolean, Column, Text, DateTime, ForeignKey, JSON, String
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.dialects.mysql import LONGTEXT

from src.config import DATABASE_URL

Base = declarative_base()

class Tool(Base):
    __tablename__ = 'tools'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36))
    name = Column(String(100), nullable=False)
    description = Column(LONGTEXT if 'mysql' in DATABASE_URL else Text, nullable=False)
    link = Column(String(255), nullable=True)
    toolkit = Column(String(30), nullable=False, default='API')
    url = Column(String(255), nullable=False)
    method = Column(String(7), nullable=False, default='GET')
    args = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)

    # Relationship to headers
    headers = relationship('Header', back_populates='tool', passive_deletes=True, cascade="all, delete, delete-orphan")
    
class Header(Base):
    __tablename__ = 'headers'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tool_id = Column(String(36), ForeignKey('tools.id', ondelete='CASCADE'), nullable=False, unique=True)
    key = Column(String(255), nullable=False)
    value = Column(Text, nullable=False)
    encrypted = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)
    
    # Relationship to tool
    tool = relationship('Tool', back_populates='headers')