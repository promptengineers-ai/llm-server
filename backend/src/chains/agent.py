from src.factories.embedding import EmbeddingFactory
from src.models import Agent
from src.utils.llm import filter_models
from src.services import LLMService, RetrievalService
from src.utils import retrieve_system_message, retrieve_chat_messages
from src.utils.tool import gather_tools

retrieval_service = RetrievalService()

def agent_chain(body: Agent, endpoints: list[dict] = None, user_id: str = None):
    system = retrieve_system_message(body.messages, use_class=True if not body.tools else False)
    filtered_messages = retrieve_chat_messages(body, use_class=True, return_system=False)
    chat_history = list(zip(filtered_messages[::2], filtered_messages[1::2]))
    retriever = None
    if body.retrieval.provider and body.retrieval.indexes:
        embedding = EmbeddingFactory(llm=body.retrieval.embedding)
        retriever = retrieval_service.retriever(
			retrieval=body.retrieval,
			embedding=embedding,
			user_id=user_id,
		)
    
    llm_service = LLMService(model_list=filter_models(body.model))
    llm = llm_service.chat()
    if body.tools:
        tools = gather_tools(
            tools=body.tools,
            retriever=retriever,
            endpoints=endpoints
        )
        agent = llm_service.agent(
            system=system,
            tools=tools,
            history=chat_history,
            memory=body.memory
        )

    chain = agent if body.tools else llm
    return chain, filtered_messages
