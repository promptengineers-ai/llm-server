import ujson

from fastapi import APIRouter, Depends, Request, Response, HTTPException
from fastapi.responses import StreamingResponse

from server.controllers.chat_controller import ChatController
from server.models.request import (ReqBodyChat, ReqBodyAgentChat,
									ReqBodyVectorstoreChat, ReqBodyAgentPluginsChat)
from server.models.response import (ResponseChat, ResponseAgentChat, ResponseVectorstoreChat,
									ResponseAgentPluginsChat, RESPONSE_STREAM_AGENT_PLUGINS_CHAT,
									RESPONSE_STREAM_AGENT_CHAT, RESPONSE_STREAM_VECTORSTORE_CHAT,
									RESPONSE_STREAM_CHAT)
from server.repos.user import UserRepo
from server.services.auth import get_current_user
from server.strategies.vectorstores import PineconeStrategy, VectorstoreContext
from server.utils import logger

user_repo = UserRepo()
router = APIRouter()
TAG = "Chat"

def get_chat_controller(request: Request) -> ChatController:
	return ChatController(request=request)

#################################################
# ChatGPT
#################################################
@router.post(
	"/chat",
	dependencies=[Depends(get_current_user)],
	tags=[TAG],
	response_model=ResponseChat,
	responses={
		200: {
			"content": {
				"text/event-stream": {
					"example": RESPONSE_STREAM_CHAT
				}
			}
		}
	},
)
async def chat(
	body: ReqBodyChat,
	chat_controller: ChatController = Depends(get_chat_controller),
):
	"""Chat endpoint."""
	try:
		logger.debug('[POST /chat] Query: %s', str(body))
		# You can use the stream variable in your function as needed
		if not body.stream:
			# Format Response
			result, cb = chat_controller.langchain_http_chat(
				messages=body.messages,
				model=body.model,
				temperature=body.temperature
			)
			data = ujson.dumps({
				'message': result,
				'usage': {
					'total_tokens': cb.total_tokens,
					'prompt_tokens': cb.prompt_tokens,
					'completion_tokens': cb.completion_tokens,
					'total_cost': cb.total_cost,
					'successful_requests': cb.successful_requests
				},
			})
			logger.debug('[POST /chat] Result: %s', str(data))
			return Response(
				content=data,
				media_type='application/json',
				status_code=200
			)

		return StreamingResponse(
			chat_controller.langchain_stream_chat(
				messages=body.messages,
				model=body.model,
				temperature=body.temperature
			),
			headers={
				"Cache-Control": "no-cache",
				"Connection": "keep-alive",
				"Content-Type": "text/event-stream",
			}
		)
	except Exception as e:
		logger.error("Error in chat endpoint: %s", e, stack_info=True)
		raise HTTPException(status_code=500, detail="Internal Server Error") from e



#################################################
# Langchain Agent
#################################################
@router.post(
	"/chat/agent",
	dependencies=[Depends(get_current_user)],
	tags=[TAG],
	response_model=ResponseAgentChat,
	responses={
		200: {
			"content": {
				"text/event-stream": {
					"example": RESPONSE_STREAM_AGENT_CHAT
				}
			}
		}
	},
)
async def chat_agent(
	body: ReqBodyAgentChat,
	chat_controller: ChatController = Depends(get_chat_controller),
):
	"""Chat endpoint."""
	try:
		# You can use the stream variable in your function as needed
		if not body.stream:
			# Format Response
			result, cb = chat_controller.langchain_http_agent_chat(
				messages=body.messages,
				model=body.model,
				temperature=body.temperature,
				tools=body.tools
			)
			data = ujson.dumps({
				'message': result,
				'usage': {
					'total_tokens': cb.total_tokens,
					'prompt_tokens': cb.prompt_tokens,
					'completion_tokens': cb.completion_tokens,
					'total_cost': cb.total_cost,
					'successful_requests': cb.successful_requests
				},
			})
			logger.debug('[POST /chat/agent] Result: %s', str(data))
			return Response(
				content=data,
				media_type='application/json',
				status_code=200
			)

		return StreamingResponse(
			chat_controller.langchain_stream_agent_chat(
				messages=body.messages,
				model=body.model,
				temperature=body.temperature,
				tools=body.tools
			),
			headers={
				"Cache-Control": "no-cache",
				"Connection": "keep-alive",
				"Content-Type": "text/event-stream",
			}
		)
	except Exception as e:
		logger.error("Error in chat endpoint: %s", e, stack_info=True)
		raise HTTPException(status_code=500, detail="Internal Server Error") from e

#################################################
# Langchain Agent Plugins
#################################################
@router.post(
	"/chat/agent/plugins",
	dependencies=[Depends(get_current_user)],
	tags=[TAG],
	response_model=ResponseAgentPluginsChat,
	responses={
		200: {
			"content": {
				"text/event-stream": {
					"example": RESPONSE_STREAM_AGENT_PLUGINS_CHAT
				}
			}
		}
	},
)
async def chat_agent_plugins(
	body: ReqBodyAgentPluginsChat,
	chat_controller: ChatController = Depends(get_chat_controller),
):
	"""Chat endpoint."""
	try:
		# You can use the stream variable in your function as needed
		if not body.stream:
			# Format Response
			result, cb = chat_controller.langchain_http_agent_plugins_chat(
				messages=body.messages,
				model=body.model,
				temperature=body.temperature,
				plugins=body.plugins
			)
			data = ujson.dumps({
				'message': result,
				'usage': {
					'total_tokens': cb.total_tokens,
					'prompt_tokens': cb.prompt_tokens,
					'completion_tokens': cb.completion_tokens,
					'total_cost': cb.total_cost,
					'successful_requests': cb.successful_requests
				},
			})
			logger.debug('[POST /chat/agent/plugins] Result: %s', str(data))
			return Response(
				content=data,
				media_type='application/json',
				status_code=200
			)

		return StreamingResponse(
			chat_controller.langchain_stream_agent_plugins_chat(
				messages=body.messages,
				model=body.model,
				temperature=body.temperature,
				plugins=body.plugins
			),
			headers={
				"Cache-Control": "no-cache",
				"Connection": "keep-alive",
				"Content-Type": "text/event-stream",
			}
		)
	except Exception as e:
		logger.error("Error in chat endpoint: %s", e, stack_info=True)
		raise HTTPException(status_code=500, detail="Internal Server Error") from e

#################################################
# Langchain Vectorstore Route
#################################################
@router.post(
	"/chat/vectorstore",
	dependencies=[Depends(get_current_user)],
	tags=[TAG],
	response_model=ResponseVectorstoreChat,
	responses={
		200: {
			"content": {
				"text/event-stream": {
					"example": RESPONSE_STREAM_VECTORSTORE_CHAT
				}
			}
		}
	},
)
async def chat_vector_search(
	request: Request,
	body: ReqBodyVectorstoreChat,
	chat_controller: ChatController = Depends(get_chat_controller),
):
	"""Chat Vectorstore endpoint."""
	try:
		# Log Context Details
		logger.debug('[POST /chat/vectorstore] Query: %s', str(body))

		# Retrieve User Tokens
		user_id = getattr(request.state, "user_id", None)
		required_keys = ['OPENAI_API_KEY', 'PINECONE_KEY', 'PINECONE_ENV', 'PINECONE_INDEX']
		tokens = user_repo.find_token(user_id, [*required_keys, 'PROMPTLAYER_API_KEY'])

		# Retreve Vectorstore
		logger.debug('[POST /chat/vectorstore] Namespace: %s', body.vectorstore)
		vectorstore_strategy = PineconeStrategy(
			openai_api_key=tokens.get(required_keys[0]),
			api_key=tokens.get(required_keys[1]),
			env=tokens.get(required_keys[2]),
			index_name=tokens.get(required_keys[3]),
			namespace=body.vectorstore,
		)
		vectostore_service = VectorstoreContext(vectorstore_strategy)
		vectorstore = vectostore_service.load()

		# Check if the retrieved file is empty
		if not vectorstore:
			raise HTTPException(
				status_code=404,
				detail=f"Vectorstore {body.vectorstore} not found"
			)

		# You can use the stream variable in your function as needed
		if not body.stream:
			# Format Response
			result, cb = chat_controller.langchain_http_vectorstore_chat(
				messages=body.messages,
				model=body.model,
				temperature=body.temperature,
				vectorstore=vectorstore,
			)
			data = ujson.dumps({
				'message': result,
				'usage': {
					'total_tokens': cb.total_tokens,
					'prompt_tokens': cb.prompt_tokens,
					'completion_tokens': cb.completion_tokens,
					'total_cost': cb.total_cost,
					'successful_requests': cb.successful_requests
				},
			})
			logger.debug('[POST /chat/vectorstore] Result: %s', str(data))
			return Response(
				content=data,
				media_type='application/json',
				status_code=200
			)

		# Process Query
		return StreamingResponse(
			chat_controller.langchain_stream_vectorstore_chat(
				messages=body.messages,
				model=body.model,
				temperature=body.temperature,
				vectorstore=vectorstore,
			),
			media_type="text/event-stream"
		)
	except Exception as e:
		logger.error("Error in chat endpoint: %s", e, stack_info=True)
		raise HTTPException(status_code=500, detail="Internal Server Error") from e
