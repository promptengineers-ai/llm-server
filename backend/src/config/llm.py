from enum import Enum
from src.config import (ANTHROPIC_API_KEY, GROQ_API_KEY, 
                        OLLAMA_BASE_URL, OPENAI_API_KEY, 
                        AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT,
                        AZURE_OPENAI_API_VERSION)
from src.utils.llm import model_sets

class OpenAIModels(Enum):
	GPT_3_5_TURBO = 'gpt-3.5-turbo'
	GPT_3_5_TURBO_16K = 'gpt-3.5-turbo-0125'
	GPT_3_5_TURBO_MARCH = 'gpt-3.5-turbo-0301'
	GPT_4 = 'gpt-4'
	GPT_4_MARCH = 'gpt-4-0314'
	GPT_4_32K = 'gpt-4-32k'
	GPT_4_32K_MARCH = 'gpt-4-32k-0314'
	GPT_4_TURBO = 'gpt-4-0125-preview'
	GPT_4_VISION = 'gpt-4-vision-preview'
	GPT_4_OMNI = 'gpt-4o'
	EMBED_ADA = 'text-embedding-ada-002'
	TEXT_EMBED_3_SMALL = 'text-embedding-3-small'
	TEXT_EMBED_3_LARGE = 'text-embedding-3-large'

class OllamaModels(Enum):
	LLAMA_2 = 'llama2'
	LLAMA_2_7B = 'llama2:7b'
	CODE_LLAMA = 'codellama'
	VICUNA = 'vicuna'
	MISTRAL = 'mistral'
	NOMIC_EMBED_TEXT = 'nomic-embed-text'
	MXBAI_EMBED_LARGE = 'mxbai-embed-large'
	PHI3 = 'phi3'
	PHI3_14B = 'phi3:14b'
	
class AzureModels(Enum):
	GPT_4_OMNI = 'gpt-4o'
	TEXT_EMBED_3_LARGE = 'text-embedding-3-large'
	
class ModelType(str, Enum):
	AZURE_GPT_4_OMNI = 'azure-gpt-4o'
	AZURE_TEXT_EMBED_3_LARGE = 'azure-text-embedding-3-large'
	OPENAI_EMBED_ADA = 'openai-text-embedding-ada'
	OPENAI_TEXT_EMBED_3_SMALL = 'openai-text-embedding-3-small'
	OPENAI_TEXT_EMBED_3_LARGE = 'openai-text-embedding-3-large'
	OPENAI_GPT_3_5_TURBO_16K = 'openai-gpt-3.5-turbo-16k'
	OPENAI_GPT_4_TURBO_PREVIEW = 'openai-gpt-4-turbo-preview'
	OPENAI_GPT_4_VISION_PREVIEW = 'openai-gpt-4-vision-preview'
	OPENAI_GPT_4_OMNI = 'openai-gpt-4o'
	OLLAMA_LLAVA = 'ollama-llava'
	OLLAMA_BAKLLAVA = 'ollama-bakllava'
	OLLAMA_MISTRAL = 'ollama-mistral'
	OLLAMA_LLAMA_2 = 'ollama-llama2'
	OLLAMA_LLAMA_2_CHAT = 'ollama_chat-llama2'
	OLLAMA_LLAMA_3 = 'ollama-llama3'
	OLLAMA_LLAMA_3_CHAT = 'ollama_chat-llama3'
	OLLAMA_NOMIC_EMBED_TEXT = 'ollama-nomic-embed-text'
	OLLAMA_MXBAI_EMBED_LARGE = 'ollama-mxbai-embed-large'
	OLLAMA_PHI3 = 'ollama-phi3'
	OLLAMA_PHI3_14B = 'ollama-phi3-14b'
	GROQ_MIXTRAL = 'groq-mixtral'
	GROQ_GEMMA_7B_IT = 'groq-gemma-7b-it'
	GROQ_LLAMA_3_1_70B = 'groq-llama3.1-70b'
	GROQ_LLAMA_3_1_405B = 'groq-llama3.1-405b'
	ANTHROPIC_HAIKU = 'anthropic-claude-3-haiku'
	ANTHROPIC_OPUS = 'anthropic-claude-3-opus'
	ANTHROPIC_SONNET = 'anthropic-claude-3.5-sonnet'

ACCEPTED_OPENAI_MODELS = {
	OpenAIModels.GPT_3_5_TURBO.value,
	OpenAIModels.GPT_3_5_TURBO_16K.value,
	OpenAIModels.GPT_4.value,
	OpenAIModels.GPT_4_32K.value,
	OpenAIModels.GPT_4_TURBO.value,
	OpenAIModels.GPT_4_VISION.value,
	OpenAIModels.EMBED_ADA.value,
	OpenAIModels.TEXT_EMBED_3_SMALL.value,
	OpenAIModels.TEXT_EMBED_3_LARGE.value,
	ModelType.OPENAI_GPT_3_5_TURBO_16K.value,
	ModelType.OPENAI_GPT_4_VISION_PREVIEW.value,
	ModelType.OPENAI_GPT_4_TURBO_PREVIEW.value,
	ModelType.OPENAI_GPT_4_OMNI.value,
}

class Embedding(str, Enum):
	EMBED_ADA = ModelType.OPENAI_EMBED_ADA.value
	TEXT_EMBED_3_SMALL = ModelType.OPENAI_TEXT_EMBED_3_SMALL.value
	TEXT_EMBED_3_LARGE = ModelType.OPENAI_TEXT_EMBED_3_LARGE.value
	NOMIC_EMBED_TEXT = ModelType.OLLAMA_NOMIC_EMBED_TEXT.value
	MXBAI_EMBED_LARGE = ModelType.OLLAMA_MXBAI_EMBED_LARGE.value

MODEL_LIST = [
    ## Azure
    {
		"model_name": ModelType.AZURE_GPT_4_OMNI,
		"embedding": False,
		"multimodal": True,
		"open_source": False,
		"litellm_params": {
			"model": f"azure/{AzureModels.GPT_4_OMNI.value}",
			"api_key": AZURE_OPENAI_API_KEY,
			"azure_deployment": 'pe-gpt-4o',
			"azure_endpoint": AZURE_OPENAI_ENDPOINT,
			"api_version": AZURE_OPENAI_API_VERSION
		},
	},
    {
		"model_name": ModelType.AZURE_TEXT_EMBED_3_LARGE,
		"embedding": True,
		"multimodal": False,
		"open_source": False,
		"litellm_params": {
			"model": f"azure/{AzureModels.TEXT_EMBED_3_LARGE.value}",
			"api_key": AZURE_OPENAI_API_KEY,
			"azure_deployment": 'pe-text-embedding-3-large',
			"azure_endpoint": AZURE_OPENAI_ENDPOINT,
			"api_version": AZURE_OPENAI_API_VERSION
		},
	},
    ## OpenAI
	{
		"model_name": ModelType.OPENAI_EMBED_ADA,
		"embedding": True,
		"multimodal": False,
		"open_source": False,
		"litellm_params": {
			"model": f"openai/{OpenAIModels.EMBED_ADA.value}",
			"api_key": OPENAI_API_KEY
		},
	},
	{
		"model_name": ModelType.OPENAI_TEXT_EMBED_3_SMALL,
		"embedding": True,
		"multimodal": False,
		"open_source": False,
		"litellm_params": {
			"model": f"openai/{OpenAIModels.TEXT_EMBED_3_SMALL.value}",
			"api_key": OPENAI_API_KEY
		},
	},
	{
		"model_name": ModelType.OPENAI_TEXT_EMBED_3_LARGE,
		"embedding": True,
		"multimodal": False,
		"open_source": False,
		"litellm_params": {
			"model": f"openai/{OpenAIModels.TEXT_EMBED_3_LARGE.value}",
			"api_key": OPENAI_API_KEY
		},
	},
	{
		"model_name": ModelType.OPENAI_GPT_3_5_TURBO_16K,
		"multimodal": False,
		"embedding": False,
		"open_source": False,
		"litellm_params": {
			"model": f"openai/gpt-3.5-turbo-16k",
			"api_key": OPENAI_API_KEY
		},
	},
 	{
		"model_name": ModelType.OPENAI_GPT_4_OMNI,
		"multimodal": True,
		"embedding": False,
		"open_source": False,
		"litellm_params": {
			"model": f"openai/gpt-4o",
			"api_key": OPENAI_API_KEY
		},
	},
	## Ollama
	{
		"model_name": ModelType.OLLAMA_NOMIC_EMBED_TEXT,
		"embedding": True,
		"multimodal": False,
		"open_source": True,
		"litellm_params": {
			"model": f"ollama/{OllamaModels.NOMIC_EMBED_TEXT.value}",
			"api_base": OLLAMA_BASE_URL
		},
	},
	{
		"model_name": ModelType.OLLAMA_MXBAI_EMBED_LARGE,
		"embedding": True,
		"multimodal": False,
		"open_source": True,
		"litellm_params": {
			"model": f"ollama/{OllamaModels.MXBAI_EMBED_LARGE.value}",
			"api_base": OLLAMA_BASE_URL
		},
	},
 	{
		"model_name": ModelType.OLLAMA_PHI3,
		"multimodal": False,
		"embedding": False,
		"open_source": True,
		"litellm_params": {
			"model": f"ollama/{OllamaModels.PHI3.value}",
			"api_base": OLLAMA_BASE_URL
		},
	},
  	{
		"model_name": ModelType.OLLAMA_PHI3_14B,
		"multimodal": False,
		"embedding": False,
		"open_source": True,
		"litellm_params": {
			"model": f"ollama/{OllamaModels.PHI3_14B.value}",
			"api_base": OLLAMA_BASE_URL
		},
	},
	{
		"model_name": ModelType.OLLAMA_LLAVA,
		"embedding": False,
		"multimodal": True,
		"open_source": True,
		"litellm_params": {
			"model": f"ollama/llava",
			"api_base": OLLAMA_BASE_URL
		},
	},
	{
		"model_name": ModelType.OLLAMA_BAKLLAVA,
		"embedding": False,
		"multimodal": True,
		"open_source": True,
		"litellm_params": {
			"model": f"ollama/bakllava",
			"api_base": OLLAMA_BASE_URL
		},
	},
	{
		"model_name": ModelType.OLLAMA_MISTRAL,
		"embedding": False,
		"multimodal": True,
		"open_source": True,
		"litellm_params": {
			"model": f"ollama/mistral",
			"api_base": OLLAMA_BASE_URL
		},
	},
	{
		"model_name": ModelType.OLLAMA_LLAMA_2_CHAT,
		"multimodal": False,
		"embedding": False,
		"open_source": True,
		"litellm_params": {
			"model": f"ollama_chat/llama2",
			"api_base": OLLAMA_BASE_URL
		},
	},
	{
		"model_name": ModelType.OLLAMA_LLAMA_3_CHAT,
		"multimodal": False,
		"embedding": False,
		"open_source": True,
		"litellm_params": {
			"model": f"ollama_chat/llama3",
			"api_base": OLLAMA_BASE_URL
		},
	},
	## Groq
	{
		"model_name": ModelType.GROQ_MIXTRAL,
		"multimodal": False,
		"embedding": False,
		"open_source": False,
		"litellm_params": {
			"model": f"groq/mixtral-8x7b-32768",
			"api_key": GROQ_API_KEY
		},
	},
	{
		"model_name": ModelType.GROQ_GEMMA_7B_IT,
		"multimodal": False,
		"embedding": False,
		"open_source": False,
		"litellm_params": {
			"model": f"groq/gemma-7b-it",
			"api_key": GROQ_API_KEY
		},
	},
	# {
	# 	"model_name": ModelType.GROQ_LLAMA_3_70B,
	# 	"multimodal": False,
	# 	"embedding": False,
	# 	"open_source": False,
	# 	"litellm_params": {
	# 		"model": f"groq/llama3-70b-8192",
	# 		"api_key": GROQ_API_KEY
	# 	},
	# },
	{
		"model_name": ModelType.GROQ_LLAMA_3_1_70B,
		"multimodal": False,
		"embedding": False,
		"open_source": False,
		"litellm_params": {
			"model": f"groq/llama-3.1-70b-versatile",
			"api_key": GROQ_API_KEY
		},
	},
	# {
	# 	"model_name": ModelType.GROQ_LLAMA_3_1_405B,
	# 	"multimodal": False,
	# 	"embedding": False,
	# 	"open_source": False,
	# 	"litellm_params": {
	# 		"model": f"groq/llama-3.1-405b-reasoning",
	# 		"api_key": GROQ_API_KEY
	# 	},
	# },
	## Anthropic
	{
		"model_name": ModelType.ANTHROPIC_HAIKU,
		"multimodal": False,
		"embedding": False,
		"open_source": False,
		"litellm_params": {
			"model": "anthropic/claude-3-haiku-20240307",
			"api_key": ANTHROPIC_API_KEY
		},
	},
	{
		"model_name": ModelType.ANTHROPIC_OPUS,
		"multimodal": True,
		"embedding": False,
		"open_source": False,
		"litellm_params": {
			"model": "anthropic/claude-3-opus-20240229",
			"api_key": ANTHROPIC_API_KEY
		},
	},
	{
		"model_name": ModelType.ANTHROPIC_SONNET,
		"multimodal": True,
		"embedding": False,
		"open_source": False,
		"litellm_params": {
			"model": "anthropic/claude-3-5-sonnet-20240620",
			"api_key": ANTHROPIC_API_KEY
		},
	},
]

ACCEPTED_OLLAMA_MODELS = model_sets('open_source')
ACCEPTED_EMBEDDING_MODELS = model_sets('embedding')
ACCEPTED_MULTIMODAL_MODELS = model_sets('multimodal')