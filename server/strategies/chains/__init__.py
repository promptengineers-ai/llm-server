"""Chain Service"""
from langchain.schema import SystemMessage
from langchain.agents import (AgentType, initialize_agent,
							AgentExecutor, OpenAIFunctionsAgent,
							load_tools)
from langchain.memory import ConversationBufferMemory
from langchain.prompts import MessagesPlaceholder
from langchain.tools import AIPluginTool
from langchain.chains import (
    ConversationChain,
	ConversationalRetrievalChain,
	LLMChain
)
from langchain.chains.chat_vector_db.prompts import CONDENSE_QUESTION_PROMPT
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
    HumanMessagePromptTemplate,
    PromptTemplate
)

from server.config import APP_ENV
from server.config.tools import AVAILABLE_TOOLS
from server.utils.chains import get_chat_history, filter_tools
from server.utils.prompts import get_system_template


class ChainService:
	"""Chain Service"""
	def __init__(self, model):
		self.model = model

	def condense_question(self):
		"""Condense a question into a single sentence."""
		return LLMChain(
			llm=self.model,
			prompt=CONDENSE_QUESTION_PROMPT,
		)

	def collect_docs(self, system_message):
		"""Collect documents from the vectorstore."""
		return load_qa_chain(
			self.model,
			chain_type='stuff',
			prompt=get_system_template(system_message)
		)

	def create_executor(
		self,
		content,
		tools,
		chat_history,
		verbose = True if APP_ENV == 'development' else False,
		return_messages = True,
		callbacks = []
	):
		memory = ConversationBufferMemory(memory_key="chat_history", return_messages=return_messages)
		system_message = SystemMessage(content=content)
		prompt = OpenAIFunctionsAgent.create_prompt(
			system_message=system_message,
			extra_prompt_messages=[MessagesPlaceholder(variable_name="chat_history")]
		)
		if len(chat_history) > 0:
			for message in chat_history:
				if message[0] and message[1]:
					memory.chat_memory.add_user_message(message[0])
					memory.chat_memory.add_ai_message(message[1])
				else:
					memory.chat_memory.add_user_message(message[0])
		agent = OpenAIFunctionsAgent(llm=self.model, tools=tools, prompt=prompt)
		return AgentExecutor(agent=agent, tools=tools, memory=memory, verbose=verbose, callbacks=callbacks)

	def conversation_retrieval(
		self,
		vectorstore,
		system_message
	):
		"""Retrieve a conversation."""
		memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
		return ConversationalRetrievalChain(
			question_generator=self.condense_question(),
			retriever=vectorstore.as_retriever(),
			memory=memory,
			combine_docs_chain=self.collect_docs(system_message),
			get_chat_history=get_chat_history,
		)

	# def agent_search(self, tools, chat_history):
	# 	"""Agent search."""
	# 	memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
	# 	if len(chat_history) > 0:
	# 		for message in chat_history:
	# 			if message[0] and message[1]:
	# 				memory.chat_memory.add_user_message(message[0])
	# 				memory.chat_memory.add_ai_message(message[1])
	# 			else:
	# 				memory.chat_memory.add_user_message(message[0])
	# 	return initialize_agent(
	# 		tools,
	# 		self.model,
	# 		agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION or AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
	# 		verbose=True,
	# 		memory=memory,
	# 		get_chat_history=get_chat_history
	# 	)

	def agent_with_tools(self, tools, system_message, chat_history, callbacks=[]):
		"""Agent search."""
		filtered_tools = filter_tools(tools, AVAILABLE_TOOLS)
		agent_executor = self.create_executor(system_message, filtered_tools, chat_history, callbacks=callbacks)
		return agent_executor

	def agent_with_plugins(self, plugins, system_message, chat_history, callbacks=[]):
		"""Agent Plugins."""
		loaded_tools = load_tools(["requests_all"])
		for tool in plugins:
			tool = AIPluginTool.from_plugin_url(tool)
			loaded_tools += [tool]
		agent_executor = self.create_executor(system_message, loaded_tools, chat_history, callbacks=callbacks)
		return agent_executor

	def conversation(self):
		prompt_template = ChatPromptTemplate.from_messages(
			[
				MessagesPlaceholder(variable_name="context"),
				HumanMessagePromptTemplate.from_template("{input}")
			]
		)
		memory = ConversationBufferMemory(return_messages=True, memory_key="context")
		llm_chain = ConversationChain(llm=self.model, prompt=prompt_template, memory=memory, verbose=False)

		return llm_chain