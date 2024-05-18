from src.config import OPENAI_API_KEY
from src.services import LLMService

llm_service = LLMService(model_list=[
	# {
	# 	"model_name": "openai-gpt-3.5-turbo-16k",
	# 	"litellm_params": {
	# 		"model": "gpt-3.5-turbo-16k",
	# 		"api_key": OPENAI_API_KEY
	# 	},
	# },
	{
		"model_name": "openai-gpt-4-turbo-preview",
		"litellm_params": {
			"model": "gpt-4-turbo-preview",
			"api_key": OPENAI_API_KEY
		},
	}
])

def csv_agent(query: str):
    agent = llm_service.agent_csv('static/homeharvest.csv')
    result = agent.invoke(query)
    return result['output']