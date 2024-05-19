from datetime import datetime

from src.models.sql.chat import Index

class IndexRepository:
    def __init__(self, user_id, db):
        self.db = db
        self.user_id = user_id
        self.soft_delete = True
    
    async def create(self):
        async with self.db.begin() as transaction:
            try:
                new_index = Index(
                    user_id=self.user_id, 
                    created_at=datetime.utcnow(), 
                    updated_at=datetime.utcnow()
                )
                self.db.add(new_index)
                await self.db.flush()
                    
                return {"id": new_index.id}
            except Exception as e:
                await transaction.rollback()
                raise e