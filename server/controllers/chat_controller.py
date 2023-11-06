"""Chat Controller"""
import openai
import asyncio
from typing import Any, Union, AsyncIterable

from fastapi import Request
from langchain.chains import LLMChain
from langchain.callbacks import AsyncIteratorCallbackHandler, get_openai_callback

from server.models.message import SystemMessage, UserMessage, AssistantMessage
from server.repos.user import UserRepo
from server.services.llm import openai_chat_functions_model
from server.strategies.callbacks import AgentStreamCallbackHandler
from server.strategies.chains import ChainService
from server.strategies.llms import OllamaStrategy, OpenAIStrategy, ModelContext
from server.strategies.vectorstores import VectorstoreContext
from server.utils import retrieve_chat_messages, retrieve_system_message
from server.utils.chains import get_chat_history
from server.utils.stream import token_stream, end_stream, wrap_done
from server.utils.validation import Validator
from server.utils.prompts import get_system_template

ACCEPTED_OPENAI_MODELS = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-1106-preview', 'gpt-4-vision-preview']
ACCEPTED_OLLAMA_MODELS = ['llama2', 'codellama', 'vicuna', 'mistral']

validator = Validator()
user_repo = UserRepo()


class ChatController:
	def __init__(self, request: Request = None):
		self.request = request
		self.user_id = getattr(request.state, "user_id", None)

	#######################################################
	## Open AI Chat GPT
	#######################################################
	def openai_http_chat(
		self,
		messages,
		model:str,
		temperature: float or int = 0.0,
		stream: bool = False,
	) -> AsyncIterable[str]:
		"""Send a message to the chatbot and yield the response."""
		response = openai.ChatCompletion.create(
			model=model,
			messages=messages,
			temperature=temperature,
			stream=stream
		)
		return response

	async def openai_stream_chat(
		self,
		messages,
		model:str,
		temperature: float or int = 0.0
	) -> AsyncIterable[str]:
		"""Send a message to the chatbot and yield the response."""
		response = openai.ChatCompletion.create(
			model=model,
			messages=messages,
			temperature=temperature,
			stream=True
		)
		for chunk in response:
			## Would also consider gathering data here
			token = chunk['choices'][0]['delta'].get('content', '')
			yield token_stream(token)
		yield end_stream()

	#######################################################
	## Open AI Function Calling
	#######################################################
	def openai_http_function_chat(
		self,
		messages,
		model: str,
		functions: list[str],
		temperature: float or int = 0
	):
		"""Send a message to the chatbot and yield the response."""
		response = openai_chat_functions_model(
			messages=messages,
			model_name=model,
			temperature=temperature,
			streaming=False,
			keys=functions,
		)
		return response

	async def openai_stream_function_chat(
		self,
		messages,
		model: str,
		functions: list[str],
		temperature: float or int = 0
	) -> AsyncIterable[str]:
		"""Send a message to the chatbot and yield the response."""
		response = openai_chat_functions_model(
			messages=messages,
			model_name=model,
			temperature=temperature,
			streaming=True,
			keys=functions,
		)
		for chunk in response:
			token = chunk['choices'][0]['delta'].get('content', '')
			yield token_stream(token)
		yield end_stream()

	##############################################################################
	## Normal Chat
	##############################################################################
	def langchain_http_chat(
		self,
		messages,
		model: str,
		temperature: float or int = 0.0,
	) -> (str, Any):
		# Retrieve the chat messages
		filtered_messages = retrieve_chat_messages(messages)
		# Retrieve the chat history
		chat_history = list(zip(filtered_messages[::2], filtered_messages[1::2]))
		# Retrieve the system message
		system_message = retrieve_system_message(messages)
		# Get Tokens
		api_key = user_repo.find_token(self.user_id, 'OPENAI_API_KEY')
		# Check allowed
		if model in ACCEPTED_OPENAI_MODELS:
			model_service = ModelContext(strategy=OpenAIStrategy(api_key=api_key))
		# Construct the model
		model = model_service.chat(
			model_name=model,
			temperature=temperature,
			streaming=False
		)
		query = {'question': filtered_messages[-1], 'context': chat_history}
		with get_openai_callback() as cb:
			# Retrieve the conversation
			chain = LLMChain(llm=model, prompt=get_system_template(system_message))
			# Begin a task that runs in the background.
			response = chain.run(query)
		return response, cb

	##############################################################################
	## Langchain Agent Chat
	##############################################################################
	def langchain_http_agent_chat(
		self,
		messages,
		model: str,
		temperature: float or int = 0.0,
		tools: list[str] = None,
	) -> (str, Any):
		"""Send a message to the chatbot and yield the response."""
		filtered_messages = retrieve_chat_messages(messages)
		# Retrieve the chat history
		chat_history = list(zip(filtered_messages[::2], filtered_messages[1::2]))
		# Retrieve the system message
		system_message = retrieve_system_message(messages)
		# Get Tokens
		api_key = user_repo.find_token(self.user_id, 'OPENAI_API_KEY')
		# Create the model
		if model in ACCEPTED_OPENAI_MODELS:
			model_service = ModelContext(strategy=OpenAIStrategy(api_key=api_key))
		else:
			raise NotImplementedError(f"Model {model} not implemented")

		model = model_service.chat(
			model_name=model,
			temperature=temperature,
			streaming=False
		)
		with get_openai_callback() as cb:
			# Retrieve the conversation
			chain = ChainService(model).agent_with_tools(tools,
														system_message,
														chat_history)
			# Begin a task that runs in the background.
			response = chain.run(filtered_messages[-1])
		return response, cb

	##############################################################################
	## Langchain Agent Plugins Chat
	##############################################################################
	def langchain_http_agent_plugins_chat(
		self,
		messages,
		model:str,
		temperature: float or int = 0.0,
		plugins: list[str] = None,
	) -> (str, Any):
		"""Send a message to the chatbot and yield the response."""
		filtered_messages = retrieve_chat_messages(messages)
		# Retrieve the chat history
		chat_history = list(zip(filtered_messages[::2], filtered_messages[1::2]))
		# Retrieve the system message
		system_message = retrieve_system_message(messages)
		# Get Tokens
		api_key = user_repo.find_token(self.user_id, 'OPENAI_API_KEY')
		# Create the model
		if model in ACCEPTED_OPENAI_MODELS:
			model_service = ModelContext(strategy=OpenAIStrategy(api_key=api_key))
		elif model in ACCEPTED_OLLAMA_MODELS:
			model_service = ModelContext(strategy=OllamaStrategy())
		else:
			raise NotImplementedError(f"Model {model} not implemented")

		model = model_service.chat(
			model_name=model,
			temperature=temperature,
			streaming=False
		)
		with get_openai_callback() as cb:
			# Retrieve the conversation
			chain = ChainService(model).agent_with_plugins(plugins,
															system_message,
															chat_history)
			# Begin a task that runs in the background.
			response = chain.run(filtered_messages[-1])
		return response, cb

	##############################################################################
	## Langchain Vectorstore Chat
	##############################################################################
	def langchain_http_vectorstore_chat(
		self,
		messages: list[Union[SystemMessage, UserMessage, AssistantMessage]] = None,
		model: str = 'gpt-3.5-turbo',
		temperature: float or int = 0.9,
		vectorstore: VectorstoreContext = None,
	) -> (str, Any):
		"""Send a message to the chatbot and yield the response."""
		filtered_messages = retrieve_chat_messages(messages)
		# Retrieve the chat history
		chat_history = list(zip(filtered_messages[::2], filtered_messages[1::2])) ## TODO: Fix this
		# Retrieve the system message
		system_message = retrieve_system_message(messages)
		# Get Tokens
		api_key = user_repo.find_token(self.user_id, 'OPENAI_API_KEY')
		# Create the model
		if model in ACCEPTED_OPENAI_MODELS:
			model_service = ModelContext(strategy=OpenAIStrategy(api_key=api_key))
		else:
			raise NotImplementedError(f"Model {model} not implemented")

		model = model_service.chat(
			model_name=model,
			temperature=temperature,
			streaming=False
		)
		with get_openai_callback() as cb:
			# Retrieve the conversation
			chain = ChainService(model).conversation_retrieval(vectorstore, system_message)
			# Begin a task that runs in the background.
			response = chain.run(filtered_messages[-1])
		return response, cb

	##############################################################################
	## Langchain Chat Stream
	##############################################################################
	async def langchain_stream_chat(
		self,
		messages,
		model:str,
		temperature: float or int = 0.0,
		stream: bool = True,
	) -> AsyncIterable[str]:
		"""Send a message to the chatbot and yield the response."""
		filtered_messages = retrieve_chat_messages(messages)
		# Retrieve the chat history
		chat_history = list(zip(filtered_messages[::2], filtered_messages[1::2]))
		# Retrieve the system message
		system_message = retrieve_system_message(messages)
		
		# Create the model
		if model in ACCEPTED_OPENAI_MODELS:
			# Get Tokens
			api_key = user_repo.find_token(self.user_id, 'OPENAI_API_KEY')
			model_service = ModelContext(strategy=OpenAIStrategy(api_key=api_key))
			callback = AsyncIteratorCallbackHandler()
			model = model_service.chat(
				model_name=model,
				temperature=temperature,
				streaming=stream,
				callbacks=[callback]
			)
			query = {'question': filtered_messages[-1], 'context': chat_history}
			# Retrieve the conversation
			chain = LLMChain(llm=model, prompt=get_system_template(system_message))
			# Begin a task that runs in the background.
			task = asyncio.create_task(wrap_done(
				chain.acall(query),
				callback.done),
			)
			# Yield the tokens as they come in.
			async for token in callback.aiter():
				yield token_stream(token)
			yield end_stream()
			await task
		elif model in ACCEPTED_OLLAMA_MODELS:
			# Get Tokens
			base_url = user_repo.find_token(self.user_id, 'OLLAMA_BASE_URL')
			if base_url:
				strategy = OllamaStrategy(base_url=base_url)
			else:
				strategy = OllamaStrategy()
			model_service = ModelContext(strategy=strategy)
			callback = AgentStreamCallbackHandler()
			llm = model_service.chat(
				model_name=model,
				temperature=temperature,
				streaming=stream,
				callbacks=[callback]
			)
			template = get_system_template(system_message)
			prompt = template.format(
				context=get_chat_history(chat_history), 
				question=filtered_messages[-1]
			)
			# Yield the tokens as they come in.
			for token in llm._stream(prompt):
				yield token_stream(token.text)
			yield end_stream()

	#######################################################
	## Langchain Agent Stream Chat
	#######################################################
	async def langchain_stream_agent_chat(
		self,
		messages,
		model:str,
		temperature: float or int = 0.9,
		tools: list[str] = None,
	):
		"""Send a message to the chatbot and yield the response."""
		filtered_messages = retrieve_chat_messages(messages)
		# Retrieve the chat history
		chat_history = list(zip(filtered_messages[::2], filtered_messages[1::2]))
		# Retrieve the system message
		system_message = retrieve_system_message(messages)
		# Get Tokens
		api_key = user_repo.find_token(self.user_id, 'OPENAI_API_KEY')
		# Create the model
		if model in ACCEPTED_OPENAI_MODELS:
			model_service = ModelContext(strategy=OpenAIStrategy(api_key=api_key))
		else:
			raise NotImplementedError(f"Model {model} not implemented")

		callback = AgentStreamCallbackHandler()
		model = model_service.chat(
			model_name=model,
			temperature=temperature,
			streaming=True,
			callbacks=[callback]
		)
		query = {'input': filtered_messages[-1], 'chat_history': chat_history}
		# tools = load_tools(tools, llm=model)
		agent_executor = ChainService(model).agent_with_tools(tools,
															system_message,
															chat_history,
															callbacks=[callback])
		task = asyncio.create_task(wrap_done(
			agent_executor.acall(query),
			callback.done),
		)
		# Yield the tokens as they come in.
		async for token in callback.aiter():
			yield token_stream(token)
		yield end_stream()
		await task

	#######################################################
	## Langchain Agent Plugins Stream Chat
	#######################################################
	async def langchain_stream_agent_plugins_chat(
		self,
		messages,
		model:str,
		temperature: float or int = 0.9,
		plugins: list[str] = None
	):
		"""Send a message to the chatbot and yield the response."""
		filtered_messages = retrieve_chat_messages(messages)
		# Retrieve the chat history
		chat_history = list(zip(filtered_messages[::2], filtered_messages[1::2]))
		# Retrieve the system message
		system_message = retrieve_system_message(messages)
		# Get Tokens
		api_key = user_repo.find_token(self.user_id, 'OPENAI_API_KEY')
		# Create the model
		if model in ACCEPTED_OPENAI_MODELS:
			model_service = ModelContext(strategy=OpenAIStrategy(api_key=api_key))
		else:
			raise NotImplementedError(f"Model {model} not implemented")

		callback = AgentStreamCallbackHandler()
		model = model_service.chat(
			model_name=model,
			temperature=temperature,
			streaming=True,
			callbacks=[callback]
		)
		query = {'input': filtered_messages[-1], 'chat_history': chat_history}
		# tools = load_tools(tools, llm=model)
		agent_executor = ChainService(model).agent_with_plugins(plugins,
															system_message,
															chat_history,
															callbacks=[callback])
		task = asyncio.create_task(wrap_done(
			agent_executor.acall(query),
			callback.done),
		)
		# Yield the tokens as they come in.
		async for token in callback.aiter():
			yield token_stream(token)
		yield end_stream()
		await task

	#######################################################
	## Vectorstore
	#######################################################
	async def langchain_stream_vectorstore_chat(
		self,
		messages: list[str],
		model: str,
		temperature: float or int = 0.9,
		vectorstore: VectorstoreContext = None,
	) -> AsyncIterable[str]:
		"""Send a message to the chatbot and yield the response."""
		filtered_messages = retrieve_chat_messages(messages)
		# Retrieve the chat history
		chat_history = list(zip(filtered_messages[::2], filtered_messages[1::2]))
		# Retrieve the system message
		system_message = retrieve_system_message(messages)
		# Get Tokens
		api_key = user_repo.find_token(self.user_id, 'OPENAI_API_KEY')
		# Create the callback
		callback = AsyncIteratorCallbackHandler()
		# Create the model
		if model in ACCEPTED_OPENAI_MODELS:
			model_service = ModelContext(strategy=OpenAIStrategy(api_key=api_key))

		model = model_service.chat(
			model_name=model,
			temperature=temperature,
			streaming=True,
			callbacks=[callback]
		)
		query = {'question': filtered_messages[-1], 'chat_history': chat_history}
		# Retrieve the conversation
		qa_chain = ChainService(model).conversation_retrieval(vectorstore, system_message)
		# Begin a task that runs in the background.
		task = asyncio.create_task(wrap_done(
			qa_chain.acall(query),
			callback.done),
		)
		# Yield the tokens as they come in.
		async for token in callback.aiter():
			yield token_stream(token)
		yield end_stream()
		await task
