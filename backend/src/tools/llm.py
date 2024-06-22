
from src.config.llm import filter_models
from src.services.llm import LLMService
from langchain_core.messages import HumanMessage


def multi_modal_llm(image: str):
    llm_service = LLMService(model_list=filter_models('openai-gpt-4o'))
    llm = llm_service.chat()
    result = llm.invoke([
        HumanMessage([
            {"type": "text", "text": 'Summarize the context in this image.'},
            {
                "type": "image_url",
                "image_url": {
                    "url": image,
                    "detail": "auto"
                }
            }
        ])
    ])
    
    return result.content