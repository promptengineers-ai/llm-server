import json
import traceback
from typing import List, Optional

from fastapi import (APIRouter, File, HTTPException, Response, Request,
					UploadFile, status, Depends)

from server.config import ACCESS_KEY_ID, BUCKET, ACCESS_SECRET_KEY
from server.config.test import TEST_USER_ID
from server.controllers.storage_controller import StorageController
from server.models.response import ResponseFileStorage, ResponseRetrieveFiles
from server.services.auth import get_current_user
from server.services.storage import StorageService
from server.utils import logger

TAG = "Files"
router = APIRouter()

#################################################
## List Files
#################################################
@router.get(
	"/files",
	response_model=ResponseRetrieveFiles,
	tags=[TAG],
	dependencies=[Depends(get_current_user)],
)
async def list_files():
	try:
		result = StorageController().retrieve_files_from_bucket()
		## Format Response
		data = json.dumps({
			**result
		})
		return Response(
			content=data,
			media_type='application/json',
			status_code=200
		)
	except HTTPException as err:
		logger.error(err.detail)
		raise
	except Exception as err:
		tb = traceback.format_exc()
		logger.error("[routes.files.list_files] Exception: %s\n%s", err, tb)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

#################################################
## Add files to storage
#################################################
@router.post(
	"/files",
	response_model=ResponseFileStorage,
	tags=[TAG],
	dependencies=[Depends(get_current_user)],
)
async def save_files(
	files: List[UploadFile] = File(...)
):
	try:
		result = StorageController().save_files_to_bucket(files)
		## Format Response
		data = json.dumps({
			'message': 'File(s) Uploaded!',
			**result
		})
		return Response(
			content=data,
			media_type='application/json',
			status_code=200
		)
	except HTTPException as err:
		logger.error(err.detail)
		raise
	except Exception as err:
		logger.error(err)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

######################################
##      Delete Vector Store
######################################
@router.delete(
	"/files",
	status_code=status.HTTP_204_NO_CONTENT,
	tags=[TAG],
	dependencies=[Depends(get_current_user)],
)
async def delete_file(
	prefix: str,
):
	try:
		## Delete File
		s3client = StorageService(
			ACCESS_KEY_ID,
			ACCESS_SECRET_KEY
		)
		s3client.delete_file(
			BUCKET,
			f'users/{TEST_USER_ID}/files/{prefix}'
		)
		return Response(status_code=204)
	except Exception as err:
		raise HTTPException(
			status_code=404,
			detail=str(err)
		) from err
