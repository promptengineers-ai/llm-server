from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from src.db.strategies import VectorstoreContext
from src.factories.retrieval import RetrievalFactory
from src.config import OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_ENV, PINECONE_INDEX, POSTGRES_URL, REDIS_URL
from src.factories.embedding import EmbeddingFactory
from src.models import Agent, Retrieval
from src.utils.llm import filter_models
from src.services import LLMService, RetrievalService

retrieval_service = RetrievalService()

contextualize_q_system_prompt = """Given a chat history and the latest user question \
which might reference context in the chat history, formulate a standalone question \
which can be understood without the chat history. Do NOT answer the question, \
just reformulate it if needed and otherwise return it as is."""
contextualize_q_prompt = ChatPromptTemplate.from_messages(
	[
		("system", contextualize_q_system_prompt),
		MessagesPlaceholder("chat_history"),
		("human", "{input}"),
	]
)

qa_system_prompt = """You are an assistant for question-answering tasks. \
Use the following pieces of retrieved context to answer the question. \
If you don't know the answer, just say that you don't know. \
Use three sentences maximum and keep the answer concise.\

{context}"""

qa_prompt = ChatPromptTemplate.from_messages(
	[
		("system", qa_system_prompt),
		MessagesPlaceholder("chat_history"),
		("human", "{input}"),
	]
)


from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory, ConfigurableFieldSpec

def retrieval_chain(body: Retrieval or Agent, user_id = None): # type: ignore
	vectorstore = None
	if body.retrieval.provider and body.retrieval.index_name:
		embedding = EmbeddingFactory(llm=body.retrieval.embedding, token=OPENAI_API_KEY) # TODO: Check the index information in DB to see which was used.
		index_name_or_namespace = f"{user_id}::{body.retrieval.index_name}" if user_id else body.retrieval.index_name
		if body.retrieval.provider == 'redis':
			provider_keys={
				'redis_url': REDIS_URL,
				'index_name': index_name_or_namespace,
			}
		elif body.retrieval.provider == 'pinecone':
			provider_keys = {
				'api_key': PINECONE_API_KEY,
				'env': PINECONE_ENV,
				'index_name': PINECONE_INDEX,
				'namespace': index_name_or_namespace,
			}
		elif body.retrieval.provider == 'postgres':
			provider_keys = {
				'connection': POSTGRES_URL,
				'collection_name': index_name_or_namespace,
				'async_mode': True,
			}
		else:
			raise ValueError(f"Invalid retrieval provider {body.retrieval.provider}")

		retrieval_provider = RetrievalFactory(
			provider=body.retrieval.provider,
			embeddings=embedding.create_embedding(),
			provider_keys=provider_keys
		)
		vectostore_service = VectorstoreContext(retrieval_provider.create_strategy())
		vectorstore = vectostore_service.load()

	llm = LLMService(model_list=filter_models(body.model)).chat()
	question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
	filter_search_kwargs = body.retrieval.search_kwargs.model_dump()
	history_aware_retriever = create_history_aware_retriever(
		llm, 
		vectorstore.as_retriever(
			search_type=body.retrieval.search_type, 
			search_kwargs={k: v for k, v in filter_search_kwargs.items() if v is not None}
		), 
		contextualize_q_prompt
	)
	rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
	
	def get_session_history(chat_history) -> ChatMessageHistory:
		history = ChatMessageHistory(messages=chat_history)
		return history
	
	conversational_rag_chain = RunnableWithMessageHistory(
		rag_chain,
		get_session_history,
		input_messages_key="input",
		history_messages_key="chat_history",
		output_messages_key="answer",
		history_factory_config = [
			ConfigurableFieldSpec(
				id="chat_history",
				annotation=list,
				name="History",
				description="The chat history to be used for the conversation",
				default="",
				is_shared=True,
			),
		]
	)
	return conversational_rag_chain