"""Routes to get chat history"""
import json
import traceback

from fastapi import (APIRouter, HTTPException, Response,
					status, Depends, Request)

from server.services.auth import get_current_user
from server.controllers.history import HistoryController
from server.models.request import ReqBodyChatHistory, ReqBodyListChatHistory
from server.utils import logger, JSONEncoder

router = APIRouter()
TAG = "Chat"

def get_controller(request: Request) -> HistoryController:
	return HistoryController(request=request)

#################################################
# List Chat Histories
#################################################
@router.get(
	"/chat/history",
	dependencies=[Depends(get_current_user)],
	tags=[TAG],
	response_model=ReqBodyListChatHistory
)
async def list_chat_histories(
	page: int = 1,
	limit: int = 50,
	controller: HistoryController = Depends(get_controller),
):
	"""Creates a chat history"""
	try:
		result = await controller.index(page, limit)
		# Format Response
		data = json.dumps({
			**result
		}, cls=JSONEncoder)
		return Response(
			content=data,
			media_type='application/json',
			status_code=200
		)
	except HTTPException as err:
		logger.error(err.detail)
		raise
	except BaseException as err:
		tb = traceback.format_exc()
		logger.error("[list_chat_histories]: %s\n%s", err, tb)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

#################################################
# Create Chat History
#################################################
@router.post(
	"/chat/history",
	dependencies=[Depends(get_current_user)],
	tags=[TAG],
	response_model=ReqBodyChatHistory
)
async def create_chat_history(controller: HistoryController = Depends(get_controller),):
	"""Creates a chat history"""
	try:
		result = await controller.create()
		# Format Response
		data = json.dumps({
			**result
		})
		return Response(
			content=data,
			media_type='application/json',
			status_code=200
		)
	except HTTPException as err:
		logger.error(err.detail)
		raise
	except BaseException as err:
		tb = traceback.format_exc()
		logger.error("[create_chat_history]: %s\n%s", err, tb)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

#################################################
# Show Chat History
#################################################
@router.get(
	"/chat/history/{chat_id}",
	dependencies=[Depends(get_current_user)],
	tags=[TAG],
	response_model=ReqBodyChatHistory,
)
async def show_chat_history(
    chat_id: str,
    controller: HistoryController = Depends(get_controller),
):
	"""Creates a chat history"""
	try:
		result = await controller.show(chat_id)

		# Format Response
		data = json.dumps({
			**result
		}, cls=JSONEncoder)
		return Response(
			content=data,
			media_type='application/json',
			status_code=200
		)
	except HTTPException as err:
		logger.error("%s", err.detail)
		raise
	except BaseException as err:
		tb = traceback.format_exc()
		logger.error("[show_chat_history]: %s\n%s", err, tb)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

#################################################
# Update Chat History
#################################################
@router.put(
	"/chat/history/{chat_id}",
	dependencies=[Depends(get_current_user)],
	tags=[TAG],
	response_model=ReqBodyChatHistory,
)
async def update_chat_history(
	chat_id: str,
	controller: HistoryController = Depends(get_controller),
):
	"""Update chat history"""
	try:
		await controller.update(chat_id)
		data = json.dumps({
			'message': 'Chat history updated successfully.'
		})
		# Format Response
		return Response(status_code=200, content=data)
	except HTTPException as err:
		logger.error("%s", err.detail)
		raise
	except BaseException as err:
		tb = traceback.format_exc()
		logger.error("[update_chat_history]: %s\n%s", err, tb)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

#################################################
# Delete Chat History
#################################################
@router.delete(
	"/chat/history/{chat_id}",
	dependencies=[Depends(get_current_user)],
	tags=[TAG],
	status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_chat_history(
	chat_id: str,
	controller: HistoryController = Depends(get_controller),
):
	"""Deletes chat history"""
	try:
		await controller.delete(chat_id)
		# Format Response
		return Response(status_code=204)
	except BaseException as err:
		tb = traceback.format_exc()
		logger.error("[delete_chat_history]: %s\n%s", err, tb)
		raise HTTPException(status_code=404, detail=str(err)) from err
