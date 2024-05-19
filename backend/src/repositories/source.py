from datetime import datetime

from src.models.sql.chat import Source

class SourceRepository:
    def __init__(self, request, db):
        self.db = db
        self.user_id = request.state.user_id
        self.soft_delete = True
    
    async def create(self, source):
        async with self.db.begin() as transaction:
            try:
                item = Source(
                    user_id=self.user_id,
                    index_id=source.get("index_id"),
                    message_id=source.get("message_id"),
                    type=source.get("type"),
                    name=source.get("name"),
                    src=source.get("src"),
                    created_at=datetime.utcnow(), 
                    updated_at=datetime.utcnow()
                )
                self.db.add(item)
                await self.db.flush()
                    
                return {"id": item.id}
            except Exception as e:
                await transaction.rollback()
                raise e