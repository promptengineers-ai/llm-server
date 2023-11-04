from abc import ABC, abstractmethod
import boto3

from langchain.llms import Ollama
from langchain.chat_models import ChatOpenAI, BedrockChat

# Define the strategy interface
class LLMStrategy(ABC):
	@abstractmethod
	def chat(
		self,
		model_name: str,
		temperature: float or int = 0.9,
		streaming: bool = False,
		callbacks: list or None = None,
	):
		pass

class OpenAIStrategy(LLMStrategy):
	def __init__(self, api_key):
		self.api_key = api_key

	def chat(
		self,
		model_name: str,
		temperature: float or int = 0.9,
		streaming: bool = False,
		callbacks: list or None = None,
	) -> str:
		return ChatOpenAI(
			openai_api_key=self.api_key,
			model_name=model_name,
			temperature=temperature,
			streaming=streaming,
			callbacks=callbacks,
		)

class BedrockStrategy(LLMStrategy):
	def __init__(self, s3_access_key, s3_secret_key):
		self.client = boto3.client(
			service_name='bedrock',
			aws_access_key_id=s3_access_key,
			aws_secret_access_key=s3_secret_key,
		)
	def chat(
		self,
		model_name: str,
		temperature: float or int = 0.9,
		streaming: bool = False,
		callbacks: list or None = None,
	) -> str:
		# Similarly, this would contain logic specific to another chat model provider
		return BedrockChat(
			client=self.client,
			region_name="us-east-1",
			model_id=model_name,
			model_kwargs={
				"temperature": temperature,
			},
			streaming=streaming,
			callbacks=callbacks,
		)

class OllamaStrategy(LLMStrategy):
	def __init__(self, base_url: str = 'http://localhost:11434'):
		self.base_url = base_url

	def chat(
		self,
		model_name: str,
		temperature: float or int = 0.9,
		streaming: bool = False,
		callbacks: list or None = None,
	) -> str:
		return Ollama(
			base_url=self.base_url,
			model=model_name,
			temperature=temperature,
			callbacks=callbacks,
		)

class ModelContext:
	def __init__(self, strategy: LLMStrategy):
		self.strategy = strategy

	def chat(
		self,
		model_name: str,
		temperature: float = None,
		streaming: bool = False,
		callbacks: list or None = None,
	) -> str:
		return self.strategy.chat(
			model_name=model_name,
			temperature=temperature,
			streaming=streaming,
			callbacks=callbacks,
		)
