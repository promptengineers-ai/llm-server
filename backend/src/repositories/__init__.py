from src.infrastructure.logger import logger as logging
from fastapi import Depends, HTTPException, Request
from src.repositories.tool import ToolRepository
from src.utils.exception import NotFoundException

def get_repo(request: Request, cls=None, **kwargs):
	try:
		return cls(request=request, **kwargs)
	except NotFoundException as e:
		# Handle specific NotFoundException with a custom message or logging
		logging.warning(f"Failed to initialize {cls.__name__}: {str(e)}")
		raise HTTPException(status_code=404, detail=f"Initialization failed: {str(e)}") from e
	except Exception as e:
		# Catch all other exceptions
		logging.error(f"Unexpected error initializing {cls.__name__}: {str(e)}")
		raise HTTPException(status_code=500, detail="Internal server error") from e