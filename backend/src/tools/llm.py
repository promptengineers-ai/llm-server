from src.utils.llm import filter_models
from src.services.llm import LLMService
from langchain_core.messages import HumanMessage


def multi_modal_llm(images: list[str]):
    llm_service = LLMService(model_list=filter_models('openai-gpt-4o'))
    llm = llm_service.chat()
    result = llm.invoke([
        HumanMessage(
            content=[
                {"type": "text", "text": f"Summarize the context in this image. Annontate which summary belongs to which of the {len(images)} image(s)."}
            ] + [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": image,
                        "detail": "auto"
                    }
                } for image in images
            ]
        )
    ])
    
    return result.content