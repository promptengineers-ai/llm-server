import traceback
import ujson
from sqlalchemy.exc import IntegrityError
from fastapi import (APIRouter, Body, Depends, HTTPException, Request,
					Response, status)

from src.infrastructure.logger import logger as logging
from src.controllers.index import (retrieve_pinecone_vectorstores, 
								   delete_pinecone_index, 
								   retrieve_redis_indexes,
								   delete_redis_vectorstore)
from src.config import PINECONE_API_KEY, PINECONE_ENV, PINECONE_INDEX, REDIS_URL, retrieve_defaults
from src.middleware.auth import current_user
from src.models import PostgresPut
from src.repositories import get_repo
from src.repositories.index import IndexRepository
from src.services.cache import CacheService
from src.services.db import get_vector_db
from src.utils.validation import Validator
from src.utils.exception import NotFoundException, ValidationException

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

######################################
# Retrieve Postgess Indexes
######################################
@router.get(
	"/indexes/postgres",
	dependencies=[Depends(current_user)],
	tags=[TAG],
	responses={
		200: {
			"description": "Success",
			"content": {
				"application/json": {
					"example": {
						"indexes": [
							{
								"uuid": "acfe60c2-0733-4ca0-8a17-7b704cbea716",
								"name": "7006720682",
								"cmetadata": None
							},
							{
								"uuid": "0fb7f1de-2e18-4d2d-ac23-e329ed5f984b",
								"name": "9003299007",
								"cmetadata": None
							},
							{
								"uuid": "012677b0-273d-42bf-8ea3-6b749b4f3c97",
								"name": "form-io",
								"cmetadata": None
							},
							{
								"uuid": "bb929fc4-27a4-4e9f-aa58-97fd844f59e0",
								"name": "my-new-index-name",
								"cmetadata": None
							}
						]
					}
				}
			}
		}
	}
)
async def list_postgres_indexes(request: Request):
	try:
		token_name = "POSTGRES_URL"
		tokens = retrieve_defaults({token_name})
		url = tokens.get(token_name).replace('psycopg', 'asyncpg')
		async for db in get_vector_db(url):
			repo = get_repo(
				request=request,
				db=db,
				cls=IndexRepository
			)
			indexes = await repo.list()
			# Format Response
			data = ujson.dumps({
				'indexes': indexes
			})
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
		logging.exception(err)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err
  
  

@router.put(
    "/indexes/postgres",
    dependencies=[Depends(current_user)],
    tags=[TAG],
    responses={
		200: {
			"description": "Index name updated",
			"content": {
       			"application/json": {
              		"example": {
						"message": "Index 6901622865 updated to my-new-index-name"
					}
                }
          	},
		},
		409: {
			"description": "Index name already exists",
			"content": {
				"application/json": {
					"example": {
						"detail": "Duplicate: Index [my-new-index-name] name already exists."
					}
				}
			}
		},
		404: {
			"description": "Index not found",
			"content": {
				"application/json": {
					"example": {
						"detail": "Index with name [6901622865] not found"
					}
				}
			}
		}
	}
)
async def update_postgres_index_name(
    request: Request,
    body: PostgresPut = Body(...),
):
    try:
        token_name = "POSTGRES_URL"
        tokens = retrieve_defaults({token_name})
        url = tokens.get(token_name).replace('psycopg', 'asyncpg')
        async for db in get_vector_db(url):
            repo = get_repo(
                request=request,
                db=db,
                cls=IndexRepository
            )
            await repo.update_name(body.index_name, body.new_index_name)
            # Format Response
            data = ujson.dumps({
                'message': f'Index {body.index_name} updated to {body.new_index_name}'
            })
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
    except NotFoundException as err:
        logging.warning("NotFoundException: %s", err)
        raise HTTPException(status_code=404, detail=str(err)) from err
    except IntegrityError as err:
        if 'duplicate key value violates unique constraint' in str(err.orig):
            logging.warning("IntegrityError: Duplicate key value error: %s", err)
            raise HTTPException(status_code=409, detail=f"Duplicate: Index [{body.new_index_name}] name already exists.")
        else:
            logging.error("IntegrityError: %s", err)
            raise HTTPException(status_code=500, detail="Internal server error") from err
    except HTTPException as err:
        logging.error("HTTPException: %s", err.detail)
        raise
    except Exception as err:
        tb = traceback.format_exc()
        logging.exception(err)
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred. {str(err)}"
        ) from err
  
######################################
# Delete Postgres Index
######################################
@router.delete(
	"/indexes/postgres/{id}",
	status_code=status.HTTP_204_NO_CONTENT,
	dependencies=[Depends(current_user)],
	tags=[TAG]
)
async def delete_postgres_index(
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
