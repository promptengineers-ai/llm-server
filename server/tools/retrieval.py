"""Pinecone tools for Agent Chat"""
import ujson

from langchain.agents import tool
from langchain.embeddings.openai import OpenAIEmbeddings
from promptengineers.core.config.llm import OpenAIModels
from promptengineers.retrieval.services.pinecone import PineconeService
from promptengineers.retrieval.strategies import VectorstoreContext
from promptengineers.retrieval.factories.provider import VectorSearchProviderFactory
from promptengineers.repos.user import UserRepo
from promptengineers.core.validations import Validator
from promptengineers.core.utils import logger

#############################################################
## List Pinecone Indexes (Not very useful)
#############################################################
@tool
async def pinecone_list_indexes(
	user_id: str,
):
	"""
	Lists all indexes in Pinecone. This does not include namespaces. Use pinecone_index_info to
	list index information for a given index.

	Args:
		- user_id (str): User ID for application user.
	"""
	required_keys = ['PINECONE_KEY', 'PINECONE_ENV', 'PINECONE_INDEX']
	tokens = UserRepo().find_token(user_id, required_keys)
	Validator().validate_api_keys(tokens, required_keys)
	pinecone_service = PineconeService(
		api_key=tokens.get('PINECONE_KEY'),
		env=tokens.get('PINECONE_ENV'),
		index_name=tokens.get('PINECONE_INDEX'),
	)
	return pinecone_service.list_indexes()


#############################################################
## Get Pinecone Index Info
#############################################################
@tool
async def pinecone_index_info(
	user_id: str,
):
	"""
	List index information for an index. Includes namespaces index dimensions, and index metrics
	such as vector counts, and index creation time.

	Args:
		- user_id (str): User ID for application user.
	"""
	required_keys = ['PINECONE_KEY', 'PINECONE_ENV', 'PINECONE_INDEX']
	tokens = UserRepo().find_token(user_id, required_keys)
	Validator().validate_api_keys(tokens, required_keys)
	pinecone_service = PineconeService(
		api_key=tokens.get('PINECONE_KEY'),
		env=tokens.get('PINECONE_ENV'),
		index_name=tokens.get('PINECONE_INDEX'),
	)
	return ujson.dumps(pinecone_service.describe_index_stats().to_dict())

#############################################################
## Get Pinecone Index Info
#############################################################
@tool
async def pinecone_similarity_search(
	user_id: str,
	namespace: str,
	user_message: str,
):
	"""
	This function retrieves the most relevant documents from a specified namespace in Pinecone,
	given a user-generated query. The query should be formulated based on the user's message to
	extract meaningful information from the documents in the namespace.

	Args:
		user_id (str): The unique identifier for the application user.
		namespace (str): The namespace within Pinecone where the search will be conducted.
		user_message (str): A question rewritten detailed question generated based on the user's message, which
					will be used to find the most relevant documents in the namespace.
	"""
	required_keys = ['OPENAI_API_KEY', 'PINECONE_KEY', 'PINECONE_ENV', 'PINECONE_INDEX']
	tokens = UserRepo().find_token(user_id, required_keys)
	Validator().validate_api_keys(tokens, required_keys)
	embeddings = OpenAIEmbeddings(openai_api_key=tokens.get('OPENAI_API_KEY'))
	pinecone_service = PineconeService(
		api_key=tokens.get('PINECONE_KEY'),
		env=tokens.get('PINECONE_ENV'),
		index_name=tokens.get('PINECONE_INDEX'),
	)
	documents = pinecone_service.from_existing(embeddings, namespace).similarity_search(user_message)
	logger.debug('[tools.retrieval.pinecone_similarity_search] Result: %s', str(documents))
	return documents

#############################################################
## Pinecone Retrieval Augmented Generation
#############################################################
@tool
async def pinecone_rag(
	user_id: str,
	namespace: str,
	user_message: str,
	model: str = OpenAIModels.GPT_4_TURBO.value,
	temperature: float = 0.9,
):
	"""
	Summarize index documents in using RAG. This function retrieves the most relevant
	documents from a specified namespace in Pinecone, given a user-generated query. The query
	should be formulated based on the user's message to extract meaningful information from
	the documents in the namespace.

	Args:
		user_id (str): The unique identifier for the application user.
		namespace (str): The namespace within Pinecone where the search will be conducted.
		user_message (str): A question or statement generated based on the user's message, which
					will be used to find the most relevant documents in the namespace.
	"""
	from promptengineers.fastapi.controllers import ChatController
	required_keys = ['OPENAI_API_KEY', 'PINECONE_KEY', 'PINECONE_ENV', 'PINECONE_INDEX']
	tokens = UserRepo().find_token(user_id, required_keys)
	Validator().validate_api_keys(tokens, required_keys)
	vectorstore_strategy = VectorSearchProviderFactory.choose(
		provider='pinecone',
		user_id=user_id,
		index_name=namespace,
		user_repo=UserRepo()
	)
	vectostore_service = VectorstoreContext(vectorstore_strategy)
	vectorstore = vectostore_service.load()
	result, cb = ChatController(user_id=user_id, user_repo=UserRepo()).langchain_http_vectorstore_chat(
		[
			{'role': 'user', 'content': user_message},
		],
		model,
		temperature,
		vectorstore,
	)
	return ujson.dumps({
		'message': result,
		'usage': {
			'total_tokens': cb.total_tokens,
			'prompt_tokens': cb.prompt_tokens,
			'completion_tokens': cb.completion_tokens,
			'total_cost': cb.total_cost,
			'successful_requests': cb.successful_requests
		},
	})
