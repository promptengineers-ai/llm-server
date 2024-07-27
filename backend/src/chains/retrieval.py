from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from src.config import OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_ENV, PINECONE_INDEX, POSTGRES_URL, REDIS_URL
from src.factories.embedding import EmbeddingFactory
from src.models import Agent, Retrieval, SearchProvider
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
	if body.retrieval.provider and body.retrieval.indexes:
		embedding = EmbeddingFactory(
      		llm=body.retrieval.embedding, 
        	token=OPENAI_API_KEY
        )
		retriever = retrieval_service.retriever(
			retrieval=body.retrieval,
			embedding=embedding,
			user_id=user_id,
		)

	llm = LLMService(model_list=filter_models(body.model)).chat()
	question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
	history_aware_retriever = create_history_aware_retriever(
		llm=llm, 
		retriever=retriever, 
		prompt=contextualize_q_prompt
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