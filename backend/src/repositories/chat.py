import ujson
import hashlib
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import joinedload

from src.models import Agent as ChatBody
from src.models.sql.chat import Chat, Image, Message, Source
from src.utils.format import hash_string

class ChatRepository:
    def __init__(self, request=None, db=None, user_id: str = None):
        self.db = db
        self.user_id = user_id or request.state.user_id
    
    async def list(self):
        stmt = (
            select(Chat)
            .options(joinedload(Chat.messages).load_only(
                Message.id, Message.role, Message.content, Message.model, Message.created_at
            ))
            .where(Chat.user_id == self.user_id)
            .order_by(Chat.updated_at.desc())
        )

        # print(str(stmt.compile(compile_kwargs={"literal_binds": True})))
        result = await self.db.execute(stmt)
        chats = result.unique().scalars().all()

        chats_json = [
            {
                "id": chat.id,
                "system": chat.system or None,
                "messages": [
                    {"role": message.role, "content": message.content, "model": message.model, "created_at": message.created_at.isoformat()}
                    for message in sorted(chat.messages, key=lambda m: m.created_at)  # Sort messages here if not sorted in model
                ],
                "retrieval": ujson.loads(chat.retrieval) if chat.retrieval else None,
                "tools": ujson.loads(chat.tools) if chat.tools else None,
                "created_at": chat.created_at.isoformat(),
                "updated_at": chat.updated_at.isoformat(),
            }
            for chat in chats
        ]

        return chats_json
    
    async def create(self, chat: ChatBody):
        async with self.db.begin() as transaction:
            try:
                new_chat = Chat(user_id=self.user_id,
                                system=chat.system,
                                retrieval=chat.retrieval.model_dump_json(),
                                tools=ujson.dumps(chat.tools), 
                                created_at=datetime.utcnow(), 
                                updated_at=datetime.utcnow())
                self.db.add(new_chat)
                await self.db.flush()

                for message in chat.messages:
                    
                    new_message = Message(chat_id=new_chat.id, 
                                          role=message["role"], 
                                          content=message["content"],
                                          model=message.get("model"), 
                                          created_at=datetime.utcnow())
                    self.db.add(new_message)
                    await self.db.flush()
                    
                    images = message.get("images", [])
                    for image in images:
                        new_image = Image(
                            message_id=new_message.id, 
                            content=image
                        )
                        self.db.add(new_image)
                        
                    sources = message.get("sources", [])
                    for source in sources:
                        new_source = Source(
                            message_id=new_message.id,
                            name=source.get("name"), 
                            type=source.get("type"),
                            src=source.get("src"),
                        )
                        self.db.add(new_source)
                    
                    
                return {"id": new_chat.id}
            except Exception as e:
                await transaction.rollback()
                raise e
        
        
    async def find(self, chat_id: int):
        stmt = (
            select(Chat)
            .options(
                joinedload(Chat.messages).joinedload(Message.images),
                joinedload(Chat.messages).joinedload(Message.sources)
            )
            .where(Chat.id == chat_id, Chat.user_id == self.user_id)
        )
        result = await self.db.execute(stmt)
        chat = result.scalars().first()
        if chat:
            chat_json = {
                "id": chat.id,
                "system": chat.system or None,
                "messages": [
                    {
                        "role": message.role, 
                        "content": message.content,
                        "model": message.model or None,
                        "images": [
                            image.content for image in message.images
                        ],
                        "sources": [
                            {
                                "name": source.name,
                                "type": source.type,
                                "src": source.src
                            }
                            for source in message.sources
                        ],
                        "created_at": message.created_at.isoformat()
                    }
                    for message in chat.messages
                ],
                "retrieval": ujson.loads(chat.retrieval) if chat.retrieval else None,
                "tools": ujson.loads(chat.tools) if chat.tools else None,
                "created_at": chat.created_at.isoformat(),
                "updated_at": chat.updated_at.isoformat(),
            }
            return chat_json
        return None
    
    async def update(self, chat_id: int, updates: ChatBody):
        async with self.db.begin() as transaction:
            try:
                # Fetch the chat and its messages
                stmt = select(Chat).options(joinedload(Chat.messages)).where(Chat.id == chat_id, Chat.user_id == self.user_id)
                result = await self.db.execute(stmt)
                chat = result.scalars().first()

                if chat:
                    # Soft delete all current messages
                    for message in chat.messages:
                        await self.db.delete(message)

                    # Set the updated_at field
                    chat.updated_at = datetime.utcnow()
                    
                    # Update tools, system, and retrieval if present in updates
                    if updates.system is not None:
                        if chat.system != updates.system:
                            chat.system = updates.system
                    
                    if updates.tools is not None:
                        new_tools_json = ujson.dumps(updates.tools)
                        current_tools_hash = hash_string(chat.tools)
                        new_tools_hash = hash_string(new_tools_json)
                        
                        if current_tools_hash != new_tools_hash:
                            chat.tools = new_tools_json
                        
                    if updates.retrieval is not None:
                        new_retrieval_json = updates.retrieval.model_dump_json()
                        current_retrieval_hash = hash_string(chat.retrieval)
                        new_retrieval_hash = hash_string(new_retrieval_json)

                        if current_retrieval_hash != new_retrieval_hash:
                            chat.retrieval = new_retrieval_json

                    # Add new messages
                    messages = updates.messages
                    if messages:
                        for message_data in messages:
                            new_message = Message(chat_id=chat_id, 
                                                  role=message_data["role"], 
                                                  content=message_data["content"], 
                                                  model=message_data.get("model"), 
                                                  created_at=datetime.utcnow())
                            self.db.add(new_message)
                            await self.db.flush()

                            images = message_data.get("images", [])
                            for image in images:
                                new_image = Image(
                                    message_id=new_message.id, 
                                    content=image
                                )
                                self.db.add(new_image)

                            sources = message_data.get("sources", [])
                            for source in sources:
                                new_source = Source(
                                    message_id=new_message.id,
                                    name=source.get("name"), 
                                    type=source.get("type"),
                                    src=source.get("src"),
                                )
                                self.db.add(new_source)

                    # Return the updated chat information
                    return {"id": chat.id, "updated_at": chat.updated_at.isoformat()}
            except Exception as e:
                await transaction.rollback()
                raise e

    async def delete(self, chat_id: int):
        async with self.db.begin():
            stmt = select(Chat).where(Chat.id == chat_id, Chat.user_id == self.user_id)
            result = await self.db.execute(stmt)
            chat = result.scalars().first()
            if chat:
                await self.db.delete(chat)
                return True
            return None