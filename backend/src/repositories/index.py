import uuid
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.utils.exception import NotFoundException

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
				# Convert UUID to string if 'uuid' column exists
				if 'uuid' in row_dict and isinstance(row_dict['uuid'], uuid.UUID):
					row_dict['uuid'] = str(row_dict['uuid'])
				result_dicts.append(row_dict)
			return result_dicts
		finally:
			await conn.close()
			
	async def update_name(self, old_name: str, new_name: str):
		query = text("""
			UPDATE langchain_pg_collection
			SET name = :new_name
			WHERE name = :old_name
		""")

		conn = await self.db.connection()
		try:
			result = await conn.execute(query, {
				"old_name": f"{self.user_id}::{old_name}",
				"new_name": f"{self.user_id}::{new_name}"
			})
			if result.rowcount == 0:
				raise NotFoundException(f"Index with name {old_name} not found")
			await self.db.commit()
		finally:
			await conn.close()