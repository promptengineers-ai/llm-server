from datetime import datetime
from fastapi import HTTPException, Request, Depends
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.infrastructure.logger import logger as logging
from src.models.sql.tool import Header, Tool
from src.models.tools import APITool
from src.services.db import get_db
from src.utils.auth import decrypt, encrypt
from src.utils.exception import NotFoundException
from src.utils.format import find_differences
from src.utils.tool import tool_details


class ToolRepository:
	def __init__(
		self, 
		request: Request = None, 
		db: AsyncSession = None,
		user_id: str = None
	):
		self.db = db
		self.user_id = user_id or request.state.user_id
  
	async def endpoints(self):
		async with self.db.begin() as transaction:
			try:
				stmt = (
					select(Tool)
					.options(joinedload(Tool.headers))
					.where(Tool.user_id == self.user_id)
				)
				result = await self.db.execute(stmt)
				tools = result.unique().scalars().all()
				endpoints = [
					{
						"id": tool.id,
						"name": tool.name,
						"description": tool.description,
						"link": tool.link,
						"toolkit": tool.toolkit,
						"url": tool.url,
						"method": tool.method,
						"args": tool.args,
						"headers": {
							header.key: decrypt(header.value) if header.encrypted else header.value
							for header in tool.headers
						}
					}
					for tool in tools
				]
				return endpoints
			except Exception as e:
				await transaction.rollback()
				raise e
	
	async def list(self):
		endpoints = await self.endpoints()
		tools = tool_details(endpoints, user_id=self.user_id)
		return tools

	async def create(self, tool: APITool):
		async with self.db.begin() as transaction:
			try:
				new_tool = Tool(
					name=tool.name,
					description=tool.description,
					link=tool.link,
					toolkit=tool.toolkit,
					url=tool.url,
					method=tool.method,
					args=tool.args,
					user_id=self.user_id
				)
				self.db.add(new_tool)
				await self.db.flush()

				for key, data in tool.headers.items():
					encrypted = data.get("encrypted", False)
					if encrypted:
						data["value"] = encrypt(data["value"])

					new_header = Header(
						key=key,
						value=data["value"],
						encrypted=encrypted,
						tool_id=new_tool.id
					)
					self.db.add(new_header)

				return {"value": new_tool.name}
			
			except IntegrityError as e:
				await transaction.rollback()

				# Check if the error is due to the unique constraint
				if "uq_tools_name_user_id" in str(e.orig):
					raise HTTPException(
		 				status_code=409, 
		 				detail=f"Tool [{tool.name}] already exists."
	   				)
				else:
					raise e  # Re-raise if it's a different IntegrityError	
			except Exception as e:
				await transaction.rollback()
				raise e

	async def find(self, tool_value: str):
		async with self.db.begin() as transaction:
			try:
				stmt = select(Tool).options(joinedload(Tool.headers)).where(Tool.name == tool_value, Tool.user_id == self.user_id)
				result = await self.db.execute(stmt)
				tool = result.scalars().first()
				if tool:
					tool_json = {
						"id": tool.id,
						"name": tool.name,
						"description": tool.description,
						"link": tool.link,
						"toolkit": tool.toolkit,
						"url": tool.url,
						"method": tool.method,
						"args": tool.args,
						"headers": {
							header.key: {
								"value": decrypt(header.value) if header.encrypted else header.value,
								"encrypted": header.encrypted
							} for header in tool.headers
						}
					}
					return tool_json
				raise NotFoundException(f"Tool with name {tool_value} not found.")
			except Exception as e:
				await transaction.rollback()
				raise Exception(str(e))

	async def update(self, tool_value: str, updates: APITool):
		async with self.db.begin() as transaction:
			try:
				# Fetch the tool and its headers
				stmt = select(Tool).options(joinedload(Tool.headers)).where(Tool.name == tool_value, Tool.user_id == self.user_id)
				result = await self.db.execute(stmt)
				tool = result.scalars().first()

				if tool:
					tool_json = {
						"name": tool.name,
						"description": tool.description,
						"link": tool.link,
						"toolkit": tool.toolkit,
						"url": tool.url,
						"method": tool.method,
						"args": tool.args,
						"headers": {
							header.key: {
								"value": decrypt(header.value) if header.encrypted else header.value,
								"encrypted": header.encrypted
							} for header in tool.headers
						}
					}
					diff = find_differences(tool_json, updates.dict())
					logging.debug(f"Found differences: {diff}")
					
					if 'headers' in diff:
						# Delete existing headers
						for header in tool.headers:
							await self.db.delete(header)
						await self.db.flush()

						# Add new headers
						for key, data in updates.headers.items():
							encrypted = data.get("encrypted", False)
							if encrypted:
								data["value"] = encrypt(data["value"])

							new_header = Header(
								key=key,
								value=data["value"],
								encrypted=encrypted,
								tool_id=tool.id
							)
							self.db.add(new_header)

						await self.db.flush()

					# Update other fields
					for key in diff:
						if key != 'headers':
							setattr(tool, key, updates.dict()[key])
					
					if diff:
						tool.updated_at = datetime.utcnow()
					else:
						logging.debug("No differences found, skipping update.")

					# Return the updated tool information
					return {"value": tool.name, "updated_at": tool.updated_at.isoformat()}
				else:
					raise NotFoundException(f"Tool with name {tool_value} not found.")
					
			except IntegrityError as e:
				if "duplicate key value violates unique constraint" in str(e.orig):
					# Handle specific unique constraint violation
					logging.warning("Duplicate header key detected, rolling back transaction.")
				await transaction.rollback()
				raise e
			except NotFoundException as e:
				await transaction.rollback()
				raise NotFoundException(str(e))
			except Exception as e:
				await transaction.rollback()
				raise e


	async def delete(self, tool_name: str):
		async with self.db.begin():
			stmt = select(Tool).where(Tool.name == tool_name, Tool.user_id == self.user_id)
			result = await self.db.execute(stmt)
			tool = result.scalars().first()
			if tool:
				await self.db.delete(tool)
				return True
			return None

def tool_repo(request: Request = None, db: AsyncSession = Depends(get_db), user_id: str = None) -> ToolRepository:
	try:
		return ToolRepository(request=request, db=db, user_id=user_id)
	except NotFoundException as e:
		# Handle specific NotFoundException with a custom message or logging
		logging.warning(f"Failed to initialize ToolRepository: {str(e)}")
		raise HTTPException(status_code=404, detail=f"Initialization failed: {str(e)}") from e
	except Exception as e:
		# Catch all other exceptions
		logging.error(f"Unexpected error initializing ToolRepository: {str(e)}")
		raise HTTPException(status_code=500, detail="Internal server error") from e