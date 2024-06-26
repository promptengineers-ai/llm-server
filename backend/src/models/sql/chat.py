import datetime
import uuid
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, JSON, String
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.dialects.mysql import LONGTEXT

Base = declarative_base()

class Chat(Base):
    __tablename__ = 'chats'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36))
    # organization_id = Column(Integer, nullable=True)
    retrieval = Column(JSON, nullable=True)
    tools = Column(JSON, nullable=True)
    system = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)

    # Relationship to messages
    messages = relationship('Message', back_populates='chat', passive_deletes=True, cascade="all, delete, delete-orphan")
    index = relationship('Index', back_populates='chat', uselist=False, cascade='all, delete-orphan', passive_deletes=True)
            
class Message(Base):
    __tablename__ = 'messages'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chat_id = Column(String(36), ForeignKey('chats.id', ondelete='CASCADE'), nullable=True)  # Cascade deletes to chat
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    model = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)

    chat = relationship("Chat", back_populates="messages")
    images = relationship("Image", back_populates="message", cascade="all, delete-orphan")
    sources = relationship("Source", back_populates="message", cascade="all, delete-orphan")
            
class Index(Base):
    __tablename__ = 'indexes'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chat_id = Column(String(36), ForeignKey('chats.id', ondelete='CASCADE'), nullable=False, unique=True)
    index_name = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)
    chat = relationship('Chat', back_populates='index')
        
class Image(Base):
    __tablename__ = 'images'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String(36), ForeignKey('messages.id', ondelete='CASCADE'), nullable=False)
    content = Column(LONGTEXT, nullable=False)
    message = relationship("Message", back_populates="images")

class Source(Base):
    __tablename__ = 'sources'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String(36), ForeignKey('messages.id', ondelete='CASCADE'), nullable=False)
    index_id = Column(String(36), ForeignKey('indexes.id'), nullable=True)
    name = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
    src = Column(LONGTEXT, nullable=False)
    message = relationship('Message', back_populates='sources')