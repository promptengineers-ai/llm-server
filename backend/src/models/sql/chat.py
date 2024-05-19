import datetime
import uuid
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, JSON, String, Index
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Chat(Base):
    __tablename__ = 'chats'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, nullable=False)
    organization_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)
    deleted_at = Column(DateTime, nullable=True)

    # Relationship to messages
    messages = relationship('Message', back_populates='chat', passive_deletes=True, cascade="all, delete, delete-orphan")
    index = relationship('Index', back_populates='chat', uselist=False, cascade='all, delete-orphan', passive_deletes=True)

    def soft_delete(self):
        self.deleted_at = datetime.datetime.now()
        for message in self.messages:
            message.soft_delete()

    __table_args__ = (Index('ix_chats_user_id', 'user_id'),)
            
class Message(Base):
    __tablename__ = 'messages'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chat_id = Column(String(36), ForeignKey('chats.id', ondelete='CASCADE'), nullable=False)
    role = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    deleted_at = Column(DateTime, nullable=True)

    # Relationship to chat
    chat = relationship("Chat", back_populates="messages")
    sources = relationship("Source", back_populates="message", cascade="all, delete, delete-orphan")
    images = relationship("Image", back_populates="message", cascade="all, delete, delete-orphan")

    def soft_delete(self):
        self.deleted_at = datetime.datetime.now()
        for source in self.sources:
            source.soft_delete()
        for image in self.images:
            image.soft_delete()

    __table_args__ = (Index('ix_messages_chat_id', 'chat_id'),)
            
class Index(Base):
    __tablename__ = 'indexes'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chat_id = Column(String(36), ForeignKey('chats.id', ondelete='CASCADE'), nullable=False, unique=True)
    index_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)
    deleted_at = Column(DateTime, nullable=True)
    chat = relationship('Chat', back_populates='index')

    __table_args__ = (Index('ix_indexes_chat_id', 'chat_id'),)
        
class Image(Base):
    __tablename__ = 'images'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String(36), ForeignKey('messages.id', ondelete='CASCADE'), nullable=False)
    content = Column(Text, nullable=False)
    deleted_at = Column(DateTime, nullable=True)
    message = relationship("Message", back_populates="images")

    def soft_delete(self):
        self.deleted_at = datetime.datetime.now()

    __table_args__ = (Index('ix_images_message_id', 'message_id'),)

class Source(Base):
    __tablename__ = 'sources'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String(36), ForeignKey('messages.id', ondelete='CASCADE'), nullable=False)
    index_id = Column(String(36), ForeignKey('indexes.id'), nullable=True)
    name = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
    src = Column(Text, nullable=False)
    deleted_at = Column(DateTime, nullable=True)
    message = relationship('Message', back_populates='sources')

    def soft_delete(self):
        self.deleted_at = datetime.datetime.now()

    __table_args__ = (
        Index('ix_sources_message_id', 'message_id'),
        Index('ix_sources_index_id', 'index_id'),
    )
