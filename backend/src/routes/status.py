from enum import Enum
from typing import Optional

from fastapi import HTTPException, status, APIRouter, Query
from fastapi.responses import StreamingResponse

from src.infrastructure.logger import logger as logging
from src.config import APP_VERSION, REDIS_URL
from src.services.cache import CacheService
from src.utils.llm import available_models

TAG = "Status"
router = APIRouter()
cache_service = CacheService(REDIS_URL)

#######################################################################
###  Status Endpoints
#######################################################################
@router.get("/status", tags=[TAG])
async def get_application_version():
	"""Check the application status."""
	try:
		return {"version": APP_VERSION}
	except Exception as err:
		logging.exception(err)
		raise HTTPException(
			status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
			detail="Internal Server Error"
		) from err
  
@router.get("/status/{channel_name}", tags=[TAG])
async def get_events(channel_name: str):
    event_generator = await cache_service.redis_listener(channel_name)
    return StreamingResponse(event_generator(), media_type="text/event-stream")


#######################################################################
###  Models Endpoints
#######################################################################
class ModelType(str, Enum):
    embedding = "embedding"
    multimodal = "multimodal"
    
@router.get("/models", tags=['Model'], responses={
    200: {
        "content": {
            "application/json": {
                "example": {
                    "models": [
                        {"model_name": "openai-text-embedding-ada", "embedding": True, "multimodal": False},
                        {"model_name": "openai-text-embedding-3-small", "embedding": True, "multimodal": False},
                        {"model_name": "openai-gpt-4o", "multimodal": True, "embedding": False},
                        # Add the rest of the models here following the format above
                        {"model_name": "ollama_chat-llama3", "multimodal": False, "embedding": False}
                    ]
                }
            }
        },
        "description": "Successful Response"
    }
})
async def list_models(type: Optional[ModelType] = Query(None, description="Filter models by type")):
    # Retrieve user_id (assuming it's an email) from request state
    models = available_models(type)  # Assuming available_models can handle the type filter
    return {"models": models}


