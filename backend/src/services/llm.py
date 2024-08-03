
from langchain.prompts import MessagesPlaceholder
from langchain.agents import AgentExecutor, OpenAIFunctionsAgent
from langchain_core.messages import SystemMessage
from langchain.agents.agent_types import AgentType
from langchain_experimental.agents.agent_toolkits import create_csv_agent
# from langchain_community.chat_models.litellm_router import ChatLiteLLMRouter
from langchain_community.memory.kg import ConversationKGMemory
from langchain.agents.openai_functions_agent.agent_token_buffer_memory import AgentTokenBufferMemory
# from litellm import Router
from langchain_openai import ChatOpenAI, AzureChatOpenAI
from langchain_groq import ChatGroq
from langchain_community.chat_models import ChatOllama
from langchain_anthropic import ChatAnthropic

from src.models import MemoryType
from src.utils.format import flatten_tuples

class LLMService:
	def __init__(self, model_list=[]):
		self.model_list = model_list
		self.memory_types = {
			MemoryType.AGENT_TOKEN_BUFFER: AgentTokenBufferMemory,
			MemoryType.CONVERSATION_KG: ConversationKGMemory
		}
  
	def chat(
		self, 
		temperature=0.9, 
		streaming=False, 
		callbacks=None, 
		cache=False
	):
		return self.select(temperature, streaming, callbacks, cache)

	def agent_csv(
		self, 
		csv_path: str,
		verbose: bool = False
	):
		return create_csv_agent(
			self.chat(),
			csv_path,
			verbose=verbose,
			agent_type=AgentType.OPENAI_FUNCTIONS,
			return_intermediate_steps=True
		)
		
	def agent(
		self,
		system: str = "You are a helpful AI assistant.",
		history: list = [],
		tools: list = [],
		callbacks: list = [],
		memory: str = MemoryType.CONVERSATION_KG,
		verbose: bool = True,
		max_execution_time: int = 60,
		max_iterations: int = 50,
		**kwargs
	):
		system_message = SystemMessage(content=system)
		prompt = OpenAIFunctionsAgent.create_prompt(
			system_message=system_message,
			extra_prompt_messages=[MessagesPlaceholder(variable_name="chat_history")]
		)
		memory = self.memory_types[memory](memory_key="chat_history", 
								  		llm=self.chat(**kwargs), 
										return_messages=True)
		if len(history) > 0:
			history = flatten_tuples(history)
			memory.chat_memory.add_messages(history)
		agent = OpenAIFunctionsAgent(llm=self.chat(**kwargs), tools=tools, prompt=prompt)
		return AgentExecutor(
			agent=agent,
			tools=tools,
			memory=memory,
			verbose=verbose,
			callbacks=callbacks,
			return_intermediate_steps=True,
			handle_parsing_errors=True,
			max_execution_time=max_execution_time,
			max_iterations=max_iterations
		)
  
	def select(self, temperature=0, streaming=False, callbacks=None, cache=False):
		params = self.model_list[0]['litellm_params']
		model = params.get('model', None)
		api_key = params.get('api_key', None)
		api_base = params.get('api_base', None)
		split = model.split('/')
		model_provider = split[0]
		model_name = split[-1]
		
		if model_provider.startswith('openai'):
			return ChatOpenAI(
				model=model_name,
				api_key=api_key,
				temperature=temperature,
				streaming=streaming,
				callbacks=callbacks,
				cache=cache,
			)
		if model_provider.startswith('azure'):
			## https://api.python.langchain.com/en/latest/chat_models/langchain_openai.chat_models.azure.AzureChatOpenAI.html
			return AzureChatOpenAI(
				api_version=params.get('api_version'),
				azure_deployment=params.get('azure_deployment'),
				azure_endpoint=params.get('azure_endpoint'),
				openai_api_key=api_key,
				streaming=streaming,
				temperature=temperature,
				callbacks=callbacks,
				cache=cache,
			)
	
		if model_provider.startswith('anthropic'):
			return ChatAnthropic(
				model=model_name,
				api_key=api_key,
				temperature=temperature,
				streaming=streaming,
				callbacks=callbacks,
				cache=cache,
			)
		if model_provider.startswith('ollama'):
			return ChatOllama(
				model=model_name,
				base_url=api_base,
				temperature=temperature,
				streaming=streaming,
				callbacks=callbacks,
				cache=cache,
			)
		if model_provider.startswith('groq'):
			return ChatGroq(
				groq_api_key=api_key,
				model_name=model_name,
				temperature=temperature,
				streaming=streaming,
				callbacks=callbacks,
				cache=cache,
			)