from enum import Enum
from src.config import ANTHROPIC_API_KEY, GROQ_API_KEY, OPENAI_API_KEY

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
    
class ModelType(str, Enum):
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
    GROQ_MIXTRAL = 'groq-mixtral'
    GROQ_GEMMA_7B_IT = 'groq-gemma-7b-it'
    GROQ_LLAMA_3_70B = 'groq-llama3-70b'
    ANTHROPIC_HAIKU = 'anthorpic-claude-3-sonnet'
    ANTHROPIC_OPUS = 'anthorpic-claude-3-opus'
    ANTHROPIC_SONNET = 'anthorpic-claude-3-sonnet'
    
ACCEPTED_MULTIMODAL_MODELS = {
    ModelType.OLLAMA_BAKLLAVA.value,
    ModelType.OLLAMA_LLAVA.value,
    ModelType.OPENAI_GPT_4_VISION_PREVIEW.value,
    ModelType.OPENAI_GPT_4_OMNI.value,
    ModelType.ANTHROPIC_OPUS.value,
}

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

ACCEPTED_OLLAMA_MODELS = {
    OllamaModels.LLAMA_2.value,
    OllamaModels.LLAMA_2_7B.value,
    OllamaModels.CODE_LLAMA.value,
    OllamaModels.VICUNA.value,
    OllamaModels.MISTRAL.value,
    ModelType.OLLAMA_LLAVA.value,
    ModelType.OLLAMA_BAKLLAVA.value,
    ModelType.OLLAMA_MISTRAL.value,
    ModelType.OLLAMA_LLAMA_2.value,
    ModelType.OLLAMA_LLAMA_3.value,
    ModelType.OLLAMA_LLAMA_2_CHAT.value,
    ModelType.OLLAMA_LLAMA_3_CHAT.value,
    ModelType.GROQ_MIXTRAL.value,
    ModelType.GROQ_GEMMA_7B_IT.value,
    ModelType.GROQ_LLAMA_3_70B.value,
}

ACCEPTED_EMBEDDING_MODELS = {
    OpenAIModels.EMBED_ADA.value,
    OpenAIModels.TEXT_EMBED_3_SMALL.value,
    OpenAIModels.TEXT_EMBED_3_LARGE.value,
    OllamaModels.LLAMA_2.value,
    OllamaModels.LLAMA_2_7B.value,
}



MODEL_LIST = [
    {
		"model_name": ModelType.OPENAI_GPT_4_VISION_PREVIEW,
		"litellm_params": {
			"model": "openai/gpt-4-vision-preview",
			"api_key": OPENAI_API_KEY
		},
	},
	{
		"model_name": ModelType.OPENAI_GPT_3_5_TURBO_16K,
		"litellm_params": {
			"model": "openai/gpt-3.5-turbo-16k",
			"api_key": OPENAI_API_KEY
		},
	},
	{
		"model_name": ModelType.OPENAI_GPT_4_TURBO_PREVIEW,
		"litellm_params": {
			"model": "openai/gpt-4-turbo-preview",
			"api_key": OPENAI_API_KEY
		},
	},
 	{
		"model_name": ModelType.OPENAI_GPT_4_OMNI,
		"litellm_params": {
			"model": "openai/gpt-4o",
			"api_key": OPENAI_API_KEY
		},
	},
	{
		"model_name": ModelType.OLLAMA_LLAVA,
		"litellm_params": {
			"model": "ollama/llava",
			"api_base": "http://localhost:11434"
		},
	},
	{
		"model_name": ModelType.OLLAMA_BAKLLAVA,
		"litellm_params": {
			"model": "ollama/bakllava",
			"api_base": "http://localhost:11434"
		},
	},
    {
		"model_name": ModelType.OLLAMA_MISTRAL,
		"litellm_params": {
			"model": "ollama/mistral",
			"api_base": "http://localhost:11434"
		},
	},
    {
		"model_name": ModelType.OLLAMA_LLAMA_2,
		"litellm_params": {
			"model": "ollama/llama2",
			"api_base": "http://localhost:11434"
		},
	},
    {
		"model_name": ModelType.OLLAMA_LLAMA_3,
		"litellm_params": {
			"model": "ollama/llama3",
			"api_base": "http://localhost:11434"
		},
	},
    {
		"model_name": ModelType.OLLAMA_LLAMA_2_CHAT,
		"litellm_params": {
			"model": "ollama_chat/llama2",
			"api_base": "http://localhost:11434"
		},
	},
    {
		"model_name": ModelType.OLLAMA_LLAMA_3_CHAT,
		"litellm_params": {
			"model": "ollama_chat/llama3",
			"api_base": "http://localhost:11434"
		},
	},
    {
		"model_name": ModelType.GROQ_MIXTRAL,
		"litellm_params": {
			"model": "groq/mixtral-8x7b-32768",
			"api_key": GROQ_API_KEY
		},
	},
    {
		"model_name": ModelType.GROQ_GEMMA_7B_IT,
		"litellm_params": {
			"model": "groq/gemma-7b-it",
			"api_key": GROQ_API_KEY
		},
	},
    {
		"model_name": ModelType.GROQ_LLAMA_3_70B,
		"litellm_params": {
			"model": "groq/llama3-70b-8192",
			"api_key": GROQ_API_KEY
		},
	},
    {
		"model_name": ModelType.ANTHROPIC_HAIKU,
		"litellm_params": {
			"model": "anthropic/claude-3-haiku-20240307",
			"api_key": ANTHROPIC_API_KEY
		},
	},
    {
		"model_name": ModelType.ANTHROPIC_OPUS,
		"litellm_params": {
			"model": "anthropic/claude-3-opus-20240229",
			"api_key": ANTHROPIC_API_KEY
		},
	},
    {
		"model_name": ModelType.ANTHROPIC_SONNET,
		"litellm_params": {
			"model": "anthropic/claude-3-sonnet-20240229",
			"api_key": ANTHROPIC_API_KEY
		},
	},
]

def filter_models(model_names):
    # Check if model_names is a single string or a list of strings
    if isinstance(model_names, str):
        # Find the model dictionary by name and return it
        return [next((model for model in MODEL_LIST if model['model_name'] == model_names), None)]
    elif isinstance(model_names, list):
        # Return a list of model dictionaries that match the names in model_names
        return [model for model in MODEL_LIST if model['model_name'] in model_names]
    else:
        # If the input is neither a string nor a list, raise an error
        raise ValueError("Input must be a string or a list of strings.")