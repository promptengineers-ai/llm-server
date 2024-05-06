from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from src.models import Agent, Retrieval
from src.config.llm import filter_models
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

def retrieval_chain(body: Retrieval or Agent): # type: ignore
    vectorstore = None
    if body.retrieval.provider and body.retrieval.index_name:
        documents = retrieval_service.load('pdf', {'path': 'static/contract_filled.pdf'})
        chunks = retrieval_service.split(documents, 'char', 1000, 0)
        vectorstore = retrieval_service.db('faiss', chunks)

    llm = LLMService(model_list=filter_models(body.model)).chat()
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    history_aware_retriever = create_history_aware_retriever(
        llm, 
        vectorstore.as_retriever(
            search_type=body.retrieval.search_type, 
            search_kwargs=body.retrieval.search_kwargs
        ), 
        contextualize_q_prompt
    )
    chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    return chain