from typing import List, Optional
import traceback
import ujson
from src.infrastructure.logger import logger as logging

from fastapi import (APIRouter, Depends, HTTPException, Request,
					Response, status)
from src.controllers.index import (retrieve_pinecone_vectorstores, 
                                   delete_pinecone_index, 
                                   retrieve_redis_indexes,
                                   delete_redis_vectorstore)
from src.config import PINECONE_API_KEY, PINECONE_ENV, PINECONE_INDEX, REDIS_URL, retrieve_defaults
from src.middleware.auth import current_user
from src.services.cache import CacheService
from src.utils.validation import Validator
from src.utils.exception import ValidationException

TAG = "Retrieval"
router = APIRouter()
cache = CacheService(REDIS_URL)
validtor = Validator()

######################################
# Retrieve Vector Stores
######################################
@router.get(
	"/indexes/pinecone",
	dependencies=[Depends(current_user)],
	tags=[TAG]
)
async def list_pinecone_vectorstores(request: Request):
	try:
		keys = {"PINECONE_API_KEY", "PINECONE_ENV", "PINECONE_INDEX"}
		tokens = retrieve_defaults(keys)
		## Get Creds
		result = retrieve_pinecone_vectorstores(request.state.user_id, tokens)
		# Format Response
		data = ujson.dumps({
			**result
		})
		logging.debug("List Pinecone Vectorstores: %s", data)
		return Response(
			content=data,
			media_type='application/json',
			status_code=200
		)
	except ValidationException as err:
		logging.warning("ValidationException: %s", err)
		raise HTTPException(
			status_code=400,
			detail=str(err)
		) from err
	except HTTPException as err:
		logging.error("HTTPException: %s", err.detail)
		raise
	except Exception as err:
		tb = traceback.format_exc()
		logging.error("Exception: %s\n%s", err, tb)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

######################################
# Delete Vector Store
######################################
@router.delete(
	"/indexes/pinecone",
	status_code=status.HTTP_204_NO_CONTENT,
	dependencies=[Depends(current_user)],
	tags=[TAG]
)
async def delete_pinecone_vectorstore(
	prefix: str or None = None, # type: ignore
):
	try:
		tokens = {
			"PINECONE_API_KEY": PINECONE_API_KEY,
			"PINECONE_ENV": PINECONE_ENV,
			"PINECONE_INDEX": PINECONE_INDEX,
		}
		delete_pinecone_index(prefix, tokens)
		return Response(status_code=204)
	except ValidationException as err:
		logging.warning("ValidationException: %s", err)
		raise HTTPException(
			status_code=400,
			detail=str(err)
		) from err
	except Exception as err:
		raise HTTPException(status_code=404, detail=str(err)) from err

######################################
# Retrieve Redis Indexes
######################################
@router.get(
	"/indexes/redis",
	dependencies=[Depends(current_user)],
	tags=[TAG]
)
async def list_redis_indexes(request: Request):
	try:
		keys = {"REDIS_URL"}
		tokens = retrieve_defaults(keys)
		## Get Creds
		result = retrieve_redis_indexes(request.state.user_id, tokens)
		# Format Response
		data = ujson.dumps({
			**result
		})
		logging.debug("[routes.index.list_redis_indexes]: %s", data)
		return Response(
			content=data,
			media_type='application/json',
			status_code=200
		)
	except ValidationException as err:
		logging.warning("ValidationException: %s", err)
		raise HTTPException(
			status_code=400,
			detail=str(err)
		) from err
	except HTTPException as err:
		logging.error("HTTPException: %s", err.detail)
		raise
	except Exception as err:
		tb = traceback.format_exc()
		logging.error("Exception: %s\n%s", err, tb)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err
  
######################################
# Delete Redis Index
######################################
@router.delete(
	"/indexes/redis",
	status_code=status.HTTP_204_NO_CONTENT,
	dependencies=[Depends(current_user)],
	tags=[TAG]
)
async def delete_redis_index(
    request: Request,
	prefix: str or None = None, # type: ignore
):
	try:
		keys = {"REDIS_URL"}
		tokens = retrieve_defaults(keys)
		delete_redis_vectorstore(request.state.user_id, prefix, tokens)
		return Response(status_code=204)
	except ValidationException as err:
		logging.warning("ValidationException: %s", err)
		raise HTTPException(
			status_code=400,
			detail=str(err)
		) from err
	except Exception as err:
		raise HTTPException(status_code=404, 
                      		detail=str(err)) from err
