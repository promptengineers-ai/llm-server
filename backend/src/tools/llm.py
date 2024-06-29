from src.utils.llm import filter_models
from src.services.llm import LLMService
from langchain_core.messages import HumanMessage
from langchain_core.tools import ToolException


def multi_modal_llm(images: list[str]):
    valid_extensions = {'.jpg', '.jpeg', '.png', '.tiff'}
    
    for image in images:
        if not any(image.lower().endswith(ext) for ext in valid_extensions):
            raise ToolException(f"Invalid image URL: {image}. URL must end with a valid image extension.")
    
    llm_service = LLMService(model_list=filter_models('openai-gpt-4o'))
    llm = llm_service.chat()
    result = llm.invoke([
        HumanMessage(
            content=[
                {"type": "text", "text": f"Summarize the context in this image. Annotate which summary belongs to which of the {len(images)} image(s)."}
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