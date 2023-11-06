from bson import ObjectId
from fastapi import Request, HTTPException

from server.repos.user import UserRepo
from server.services.mongo import MongoService
from server.utils.validation import Validator
from server.utils import logger
from server.exceptions import ValidationException

user_repo = UserRepo()
validator = Validator()
class HistoryController:
	def __init__(self, request: Request = None):
		try:
			self.request = request
			self.user_id = getattr(request.state, "user_id", None)
			required = ['MONGO_CONNECTION']
			token = user_repo.find_token(self.user_id, required)
			if not token.get(required[0]):
				raise ValidationException(f"{required[0]} is required")
			self.history_service = MongoService(token.get(required[0]))
		except ValidationException as err:
			logger.warning("ValidationException: %s", err)
			raise HTTPException(
				status_code=400,
				detail=str(err)
			) from err

	##############################################################
	### Create Chat History
	##############################################################
	async def index(self, page: int = 1, limit: int = 10):
		result = await self.history_service.list_docs(
			{'user_id': ObjectId(self.user_id)},
			limit,
			page
		)
		return result

	##############################################################
	### Create Chat History
	##############################################################
	async def create(self):
		body = await self.request.json()
		body['user_id'] = ObjectId(self.user_id)
		result = await self.history_service.create(dict(body))
		return result

	##############################################################
	### Update Chat History
	##############################################################
	async def show(self, chat_id: str):
		result = await self.history_service.read_one(
			{'_id': ObjectId(chat_id), 'user_id': ObjectId(self.user_id)}
		)
		return result


	##############################################################
	### Update Chat History
	##############################################################
	async def update(self, chat_id: str):
		body = await self.request.json()
		result = await self.history_service.update_one(
			{'_id': ObjectId(chat_id), 'user_id': ObjectId(self.user_id)},
			dict(body)
		)
		return result

	##############################################################
	### Delete Chat History
	##############################################################
	async def delete(self, chat_id: str):
		result = await self.history_service.delete_one(
			{'_id': ObjectId(chat_id), 'user_id': ObjectId(self.user_id)}
		)
		return result
