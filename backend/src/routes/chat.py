from src.infrastructure.logger import logger as logging
import traceback
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status, APIRouter, Request
from fastapi.responses import StreamingResponse, Response, UJSONResponse

from src.repositories.chat import ChatRepository
from src.services.db import get_db
from src.middleware.auth import current_user
from src.chains.agent import agent_chain
from src.chains.retrieval import retrieval_chain
from src.models import Agent, Chat
from src.utils.llm import filter_models
from src.services import ClientService, LLMService, RetrievalService
from src.utils import chain_stream, format_agent_actions, retrieve_chat_messages
from src.utils.exception import NotFoundException

TAG = "Chat"
router = APIRouter()
client_service = ClientService()
retrieval_service = RetrievalService()


############################################################################
## Define the endpoints for chat and chat with csv
############################################################################
@router.post(
	"/chat", 
	status_code=status.HTTP_200_OK, 
	tags=[TAG],
 	dependencies=[Depends(current_user)],
	openapi_extra={
		"requestBody": {
			"content": {
				"application/json": {
					"example": Agent.__config__["json_schema_extra"]["example"],
				}
			}
		}
	}
)
async def chat(request: Request, body: Agent):
	try:     
		if not body.tools and body.retrieval.provider and body.retrieval.index_name:
			chain = retrieval_chain(body, request.state.user_id)
			query = {'input': body.messages[-1]['content']}
		else:
			chain, filtered_messages = agent_chain(body)
			query = filtered_messages
   
		if body.streaming:
			return StreamingResponse(
				chain_stream(
        			chain, 
           			query, 
              		config={
                    	'configurable': {
							'chat_history': retrieve_chat_messages(body, True)[:-1]
						}
                    }
                ),
				headers={
					"Cache-Control": "no-cache",
					"Connection": "keep-alive",
					"Content-Type": "text/event-stream",
				}
			)
		else:
			if not body.tools and body.retrieval.provider and body.retrieval.index_name:
				result = await chain.ainvoke(query)
				content = {
					'result': {
						"output": result['answer'],
						"documents": list(map(lambda x: dict(x), result['context'])),
					}
				}
			else:
				result = await chain.ainvoke(query)
				content = {
					'result': {
						"output": result.content,
						"steps": format_agent_actions(dict(result).get('intermediate_steps', []))
					}
				}
			return UJSONResponse(
				content=content,
				media_type='application/json',
				status_code=200
			)
	except ValueError as ve:
		logging.warning("Validation Error: %s", ve)
		return UJSONResponse(
			content={'detail': ve.args[0]},
			media_type='application/json',
			status_code=status.HTTP_400_BAD_REQUEST
		)
	except Exception as err:
		tb = traceback.format_exc()
		logging.error("Exception: %s\n%s", err, tb)
		raise HTTPException(status_code=500, 
					  		detail="Internal Server Error") from err
  
############################################################################
## Define the endpoints for chat with csv
############################################################################
@router.post("/chat/csv", status_code=status.HTTP_200_OK, tags=['Chat'])
async def chat_with_csv(body: Chat):
	try:
		filtered_messages = retrieve_chat_messages(body.messages)
		agent = LLMService(model_list=filter_models(body.model)).agent_csv('static/homeharvest.csv')

		if body.streaming:
			return StreamingResponse(
				chain_stream(agent, filtered_messages),
				headers={
					"Cache-Control": "no-cache",
					"Connection": "keep-alive",
					"Content-Type": "text/event-stream",
				}
			)
		else:
			result = agent.invoke({"input": filtered_messages[-1]})
			content = {
	   			'result': {
					"output": result['output'],
					"steps": format_agent_actions(result['intermediate_steps']),
				}
		  	}
			return UJSONResponse(
				content=content,
				media_type='application/json',
				status_code=200
			)
	except Exception as err:
		tb = traceback.format_exc()
		logging.error("Exception: %s\n%s", err, tb)
		raise HTTPException(status_code=500, detail="Internal Server Error") from err


############################################################################
## Chat Messages
############################################################################
def get_repo(request: Request, db: AsyncSession = Depends(get_db)) -> ChatRepository:
	try:
		return ChatRepository(request=request, db=db)
	except NotFoundException as e:
		# Handle specific NotFoundException with a custom message or logging
		logging.warning(f"Failed to initialize ChatRepository: {str(e)}")
		raise HTTPException(status_code=404, detail=f"Initialization failed: {str(e)}") from e
	except Exception as e:
		# Catch all other exceptions
		logging.error(f"Unexpected error initializing ChatRepository: {str(e)}")
		raise HTTPException(status_code=500, detail="Internal server error") from e

@router.get("/c", tags=[TAG], dependencies=[Depends(current_user)])
async def list_chats(chat_repo: ChatRepository = Depends(get_repo)):
	# Retrieve user_id (assuming it's an email) from request state
	chats = await chat_repo.list()
	return {"chats": chats}

@router.post("/c", tags=[TAG])
async def create_chat(chat: Agent, chat_repo: ChatRepository = Depends(get_repo)):
	# Retrieve user_id (assuming it's an email) from request state
	chat = await chat_repo.create(chat)
	if not chat:
		raise HTTPException(status_code=404, detail="Not found")
	return {"chat": chat}

@router.get("/c/{chat_id}", tags=[TAG], dependencies=[Depends(current_user)])
async def find_chat(chat_id: str, chat_repo: ChatRepository = Depends(get_repo)):
	# Retrieve user_id (assuming it's an email) from request state
	chat = await chat_repo.find(chat_id)
	if not chat:
		raise HTTPException(status_code=404, detail="Not found")
	return {"chat": chat}
		
@router.put("/c/{chat_id}", tags=[TAG], dependencies=[Depends(current_user)])
async def update_chat(chat_id: str, chat: Agent, chat_repo: ChatRepository = Depends(get_repo)):
	# Retrieve user_id (assuming it's an email) from request state
	chat = await chat_repo.update(chat_id, chat)
	if not chat:
		raise HTTPException(status_code=404, detail="Not found")
	return {"chat": chat}
 
@router.delete(
	"/c/{chat_id}", 
	tags=[TAG], 
	dependencies=[Depends(current_user)], 
	responses={204: {"description": "Chat deleted"}}
)
async def delete_chat(chat_id: str, chat_repo: ChatRepository = Depends(get_repo)):
	# Retrieve user_id (assuming it's an email) from request state
	await chat_repo.delete(chat_id)
	return Response(status_code=status.HTTP_204_NO_CONTENT)

