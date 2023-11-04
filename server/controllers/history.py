from bson import ObjectId
from fastapi import Request

from server.repos.user import UserRepo
from server.services.mongo import MongoService

user_repo = UserRepo()

class HistoryController:
	def __init__(self, request: Request = None):
		self.request = request
		self.user_id = getattr(request.state, "user_id", None)
		self.history_service = MongoService(user_repo.find_token(self.user_id, 'MONGO_CONNECTION'))

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
