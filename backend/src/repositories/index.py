from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

class IndexRepository:
    def __init__(self, request=None, db: AsyncSession = None, user_id: str = None):
        self.db = db
        self.user_id = user_id or request.state.user_id
    
    async def list(self):
        query = text("SELECT * FROM langchain_pg_collection WHERE name LIKE :user_id_prefix")
        compiled_query = query.compile(compile_kwargs={"literal_binds": True})
        print(f"Executing query: {compiled_query}")
        
        conn = await self.db.connection()
        try:
            result = await conn.execute(query, {"user_id_prefix": f"{self.user_id}%"})
            rows = result.fetchall()
            result_dicts = []
            for row in rows:
                row_dict = dict(zip(result.keys(), row))
                if 'name' in row_dict:
                    prefix = f"{self.user_id}::"
                    if row_dict['name'].startswith(prefix):
                        row_dict['name'] = row_dict['name'][len(prefix):]
                result_dicts.append(row_dict)
            return result_dicts
        finally:
            await conn.close()