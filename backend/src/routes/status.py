import logging
from fastapi import HTTPException, status, APIRouter
from fastapi.responses import StreamingResponse

from src.config import APP_VERSION, REDIS_URL
from src.services.cache import CacheService

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