import os
from fastapi import HTTPException, Request, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from promptengineers.core.config.test import TEST_USER_ID

from server.config import APP_SUPER_ADMIN_KEY
from server.config.tools import AVAILABLE_TOOLS


async def get_api_key_or_credentials(
    request: Request,
    http_basic_auth: HTTPBasicCredentials = Depends(HTTPBasic(auto_error=False))
):
    api_key = request.headers.get('x-api-key')

    if api_key:
        if api_key != APP_SUPER_ADMIN_KEY:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")
        return {"api_key": api_key}

    if http_basic_auth:
        return {"http_basic_auth": http_basic_auth}

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


class AuthMiddleware:
	def __init__(self, user_repo) -> None:
		self.users_db = self.load_users_from_env()
		self.user_repo = user_repo
		self.available_tools = AVAILABLE_TOOLS

	def load_users_from_env(self):
		users = {}
		for key, value in os.environ.items():
			if key.startswith("USER_"):
				username = key[5:]  # Remove 'USER_' prefix
				users[username] = value
		return users

	def check_auth(
		self,
		request: Request,
		credentials: dict = Depends(get_api_key_or_credentials)
	):
		if "api_key" in credentials:
			request.state.user_id = TEST_USER_ID
			request.state.user_repo = self.user_repo
			request.state.available_tools = self.available_tools

			return request
		else:
			http_basic_auth = credentials.get("http_basic_auth")
			user = self.users_db.get(http_basic_auth.username)
			if user is None or user != http_basic_auth.password:
				raise HTTPException(
					status_code=status.HTTP_401_UNAUTHORIZED,
					detail="Invalid credentials",
					headers={"WWW-Authenticate": "Basic"},
				)
			request.state.user_id = TEST_USER_ID
			request.state.user_repo = self.user_repo
			request.state.available_tools = self.available_tools

			return request

	def get_current_user(
		self,
		request: Request,
		credentials: HTTPBasicCredentials = Depends(HTTPBasic())
	):
		user = self.users_db.get(credentials.username)
		if user is None or user != credentials.password:
			raise HTTPException(
				status_code=status.HTTP_401_UNAUTHORIZED,
				detail="Invalid credentials",
				headers={"WWW-Authenticate": "Basic"},
			)
		else:
			request.state.user_id = TEST_USER_ID
			return request

	def with_api_key(
		self,
		request: Request,
	):
		api_key = request.headers.get('x-api-key')
		if api_key != APP_SUPER_ADMIN_KEY:
			raise HTTPException(status_code=401, detail="Unauthorized: Invalid API key")
		request.state.user_id = TEST_USER_ID
		return request