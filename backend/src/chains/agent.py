from src.models import Agent
from src.config.llm import filter_models
from src.services import LLMService, RetrievalService
from src.utils import retrieve_system_message, retrieve_chat_messages
from src.utils.tool import gather_tools

retrieval_service = RetrievalService()

def agent_chain(body: Agent):
    system = retrieve_system_message(body.messages, use_class=True if not body.tools else False)
    filtered_messages = retrieve_chat_messages(body, use_class=True, return_system=False)
    chat_history = list(zip(filtered_messages[::2], filtered_messages[1::2]))
    vectorstore = None
    if body.retrieval.provider and body.retrieval.index_name:
        documents = retrieval_service.load('pdf', {'path': 'static/contract_filled.pdf'})
        chunks = retrieval_service.split(documents, 'char', 500, 0)
        vectorstore = retrieval_service.db('faiss', chunks)
    
    llm_service = LLMService(model_list=filter_models(body.model))
    llm = llm_service.chat()
    if body.tools:
        tools = gather_tools(
            tools=body.tools,
            retrieval={
                'vectorstore': vectorstore,
                'search_type': body.retrieval.search_type,
                'search_kwargs': body.retrieval.search_kwargs
            },
        )
        agent = llm_service.agent(
            system=system,
            tools=tools,
            history=chat_history,
            memory=body.memory
        )

    chain = agent if body.tools else llm
    return chain, filtered_messages
