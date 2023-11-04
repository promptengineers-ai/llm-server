from typing import Optional, List
import ujson

from fastapi import (APIRouter, Depends, Request, Form, status,
                    Response, UploadFile, File, HTTPException)

from server.exceptions import ValidationException
from server.models.request import RequestDataLoader, RequestMultiLoader
from server.models.response import (ResponseFileLoader, ResponseCreateVectorStore,
									ResponseListPineconeVectorStores)
from server.controllers.vector_search import VectorSearchController
from server.services.auth import get_current_user
from server.utils import logger

TAG = "Vectorstores"
router = APIRouter()
#################################################
# Create vectorstore from files
#################################################
@router.post(
	"/vectorstores",
	dependencies=[Depends(get_current_user)],
	response_model=ResponseCreateVectorStore,
	tags=[TAG]
)
async def create_vectorstore(
	request: Request,
	body: RequestDataLoader
):
	"""File Loader endpoint."""
	try:
		user_id = getattr(request.state, "user_id", None)
		await VectorSearchController().create_multi_loader_vectorstore(body, user_id)

		## Format Response
		data = ujson.dumps({
			"message": 'Vectorstore Created!',
			'vectorstore': body.index_name,
		})
		return Response(
			content=data,
			media_type='application/json',
			status_code=201
		)
	except ValidationException as err:
		logger.warning("ValidationException: %s", err)
		raise HTTPException(
			status_code=400,
			detail=str(err)
		) from err
	except HTTPException as err:
		logger.error("HTTPException: %s", err.detail, stack_info=True)
		raise
	except Exception as err:
		logger.error("%s", err, stack_info=True)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

#################################################
# Create vectorstore from files
#################################################
@router.post(
	"/vectorstores/file",
	dependencies=[Depends(get_current_user)],
	response_model=ResponseFileLoader,
	tags=[TAG]
)
async def create_vectorstore_from_file(
	request: Request,
	index_name: str = Form(...),
	files: Optional[List[UploadFile]] = File(...)
):
	"""File Loader endpoint."""
	try:
		user_id = getattr(request.state, "user_id", None)
		await VectorSearchController().create_vectorstore_from_files(
			user_id,
			index_name,
			files
		)

		## Format Response
		data = ujson.dumps({
			"message": 'Vectorstore Created!',
			'vectorstore': index_name,
		})
		return Response(
			content=data,
			media_type='application/json',
			status_code=201
		)
	except ValidationException as err:
		logger.warning("ValidationException: %s", err)
		raise HTTPException(
			status_code=400,
			detail=str(err)
		) from err
	except HTTPException as err:
		logger.error("HTTPException: %s", err.detail, stack_info=True)
		raise
	except Exception as err:
		logger.error("%s", err, stack_info=True)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err


#################################################
# Create vectorstore
#################################################
@router.post(
	"/vectorstores/multi",
	dependencies=[Depends(get_current_user)],
	response_model=ResponseCreateVectorStore,
	tags=[TAG],
	# include_in_schema=False # TODO: Needs some work
)
async def create_vectorstore_from_multiple_sources(
	request: Request,
	body: RequestMultiLoader
):
	# Get Body
	body = await request.json()

	try:
		user_id = getattr(request.state, "user_id", None)
		await VectorSearchController().create_multi_loader_vectorstore(body, user_id)
		## Format Response
		data = ujson.dumps({
			'message': 'Vectorstore Created!',
			'data': body
		})
		return Response(
			content=data,
			media_type='application/json',
			status_code=201
		)
	except ValidationException as err:
		logger.warning("ValidationException: %s", err)
		raise HTTPException(
			status_code=400,
			detail=str(err)
		) from err
	except HTTPException as err:
		logger.error("%s", err.detail, stack_info=True)
		raise
	except Exception as err:
		logger.error("%s", err, stack_info=True)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err


######################################
# Retrieve Vector Stores
######################################
@router.get(
	"/vectorstores/pinecone",
	dependencies=[Depends(get_current_user)],
	response_model=ResponseListPineconeVectorStores,
	tags=[TAG]
)
async def list_pinecone_vectorstores(
	request: Request
):
	try:
		user_id = getattr(request.state, "user_id", None)
		result = VectorSearchController().retrieve_pinecone_vectorstores(user_id)
		# Format Response
		data = ujson.dumps({
			**result
		})
		logger.debug("List Pinecone Vectorstores: %s", data)
		return Response(
			content=data,
			media_type='application/json',
			status_code=200
		)
	except ValidationException as err:
		logger.warning("ValidationException: %s", err)
		raise HTTPException(
			status_code=400,
			detail=str(err)
		) from err
	except HTTPException as err:
		logger.error("HTTPException: %s", err.detail)
		raise
	except Exception as err:
		logger.error("%s", err, stack_info=True)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

######################################
# Delete Vector Store
######################################
@router.delete(
	"/vectorstores/pinecone",
	status_code=status.HTTP_204_NO_CONTENT,
	dependencies=[Depends(get_current_user)],
	tags=[TAG]
)
async def delete_pinecone_vectorstore(
	request: Request,
	prefix: str or None = None,
):
	try:
		user_id = getattr(request.state, "user_id", None)
		VectorSearchController().delete_pinecone_vectorstore(prefix, user_id)
		return Response(status_code=204)
	except ValidationException as err:
		logger.warning("ValidationException: %s", err)
		raise HTTPException(
			status_code=400,
			detail=str(err)
		) from err
	except Exception as err:
		raise HTTPException(status_code=404, detail=str(err)) from err