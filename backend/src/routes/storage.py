import os
import json
import traceback
import logging
import mimetypes
from typing import List, Any

from fastapi.responses import UJSONResponse
from fastapi import (APIRouter, File, HTTPException, Response,
					UploadFile, status, Query)

from src.config import ACCESS_KEY_ID, ACCESS_SECRET_KEY, BUCKET, TEST_USER_ID
from src.services.storage import StorageService

TAG = "Storage"
router = APIRouter()
storage_service = StorageService(ACCESS_KEY_ID, ACCESS_SECRET_KEY)

#################################################
## List Files
#################################################
@router.get(
	"/storage",
	response_model=Any,
	tags=[TAG],
	name='storage_list_files',
)
async def list_files(path: str = None):
	try:
		files = storage_service.retrieve_all_files(
	  		BUCKET, prefix=f'users/{TEST_USER_ID}/{path}' if path else f'users/{TEST_USER_ID}'
		)
		## Format Response
		data = json.dumps({'files': files})
		return Response(
			content=data,
			media_type='application/json',
			status_code=200
		)
	except HTTPException as err:
		logging.error(err.detail)
		raise
	except Exception as err:
		tb = traceback.format_exc()
		logging.error("[routes.files.list_files] Exception: %s\n%s", err, tb)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err
  
@router.get(
	"/storage/presigned",
	response_model=Any,
	tags=["Storage"],  # Replace 'YourTagHere' with actual tag
	name='storage_list_files',
)
async def list_presigned_urls(
	path: str = None, 
	download: bool = Query(False, description="Set to true to generate download links")
):
	try:
		extension = os.path.splitext(path)[1].lower().strip('.') if path else None
		if extension:
			prefix = f'users/{TEST_USER_ID}/{extension}/{path}'
		if not extension and path:
			prefix = f'users/{TEST_USER_ID}/{path}'
		if not path:
			prefix = f'users/{TEST_USER_ID}'
		# Retrieve filenames from the bucket with optional path prefix
		files = storage_service.retrieve_all_files(
			BUCKET, prefix=prefix
		)
		urls = {}
		for file in files:
			if file in prefix:
				file_path = prefix
			else:
				extension = os.path.splitext(file)[1].lower().strip('.')
				file_path = f'{prefix}/{extension}/{file}' if not path else f'{prefix}/{file}'
			# Determine MIME type for the file
			content_type = mimetypes.guess_type(file)[0] or 'application/octet-stream'
			# Generate URLs with specified content disposition, note the inversion of the `download` flag for `inline`
			url = storage_service.create_presigned_urls(
				BUCKET, 
				[file_path], 
				3600, 
				response_content_type=content_type,
				inline=not download  # Invert the download flag here
			)
			urls[file] = url.get(file_path)

		# Return formatted JSON response
		return UJSONResponse(content={'urls': urls})
	except HTTPException as err:
		logging.error(err.detail)
		raise
	except Exception as err:
		tb = traceback.format_exc()
		logging.error("[routes.files.list_files] Exception: %s\n%s", err, tb)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

#################################################
## Add files to storage
#################################################
@router.post(
	"/storage",
	response_model=Any,
	tags=[TAG],
	name='storage_add_files',
)
async def save_files(
	files: List[UploadFile] = File(...)
):
	try:
		result = storage_service.upload_files(files, BUCKET, f'users/{TEST_USER_ID}')
		## Format Response
		data = json.dumps({
			'files': result,
		})
		return Response(
			content=data,
			media_type='application/json',
			status_code=200
		)
	except HTTPException as err:
		logging.error(err.detail)
		raise
	except Exception as err:
		logging.error(err)
		raise HTTPException(
			status_code=500,
			detail=f"An unexpected error occurred. {str(err)}"
		) from err

######################################
##      Delete Vector Store
######################################
@router.delete(
	"/storage",
	status_code=status.HTTP_204_NO_CONTENT,
	tags=[TAG],
	name='storage_delete_files',
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
			prefix
		)
		return Response(status_code=204)
	except Exception as err:
		raise HTTPException(
			status_code=404,
			detail=str(err)
		) from err