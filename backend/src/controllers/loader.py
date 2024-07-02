import os
from src.infrastructure.logger import logger as logging
import tempfile
import traceback
from typing import List
from pathlib import Path as PathLib

from fastapi.responses import UJSONResponse
from fastapi import HTTPException, Request, status, Body, Query, File, UploadFile, Form


from src.config import REDIS_URL, retrieve_defaults
from src.models import FetchDocuments, UpsertDocuments, Splitter, FileLoaderType

from src.services.cache import CacheService
from src.services.document import DocumentService
from src.utils.retrieval import fetch_links
 
def loader_file_config(file, tmpdirname):
	_, file_extension = os.path.splitext(file.filename)
	file_extension_cleaned = file_extension.replace('.', '')
	
	# Check if the file extension is a valid type
	if file_extension_cleaned not in [e.value for e in FileLoaderType]:
		raise HTTPException(status_code=400, detail=f"Invalid file type: {file_extension_cleaned}")

	# Create a temporary directory to store the files
	file_path = os.path.join(tmpdirname, file.filename)
	with open(file_path, 'wb') as f: 	
		f.write(file.file.read())
	
	return {'type': file_extension_cleaned, 'file_path': file_path}


cache = CacheService(REDIS_URL)

class LoaderController:
	def __init__(self):
		self.document_service = DocumentService()

	##############################################################
	### Fetch Documents
	##############################################################
	async def fetch_documents(
		self,
		body: FetchDocuments = Body(...)
	):
		"""Creates settings"""
		try:
			documents = await self.document_service.from_loaders(
				loaders=body.loaders, 
				splitter=body.splitter,
				task_id=body.task_id
			)
			return UJSONResponse(
				content={
					'count': len(documents),
					'documents': list(map(lambda x: dict(x), documents))    
				},
				media_type='application/json',
				status_code=status.HTTP_200_OK
			)
		except HTTPException as err:
			logging.error(err.detail)
			raise
		except BaseException as err:
			tb = traceback.format_exc()
			logging.error(f"[routes.{PathLib(__file__).resolve().stem}.fetch_documents]: %s\n%s", err, tb)
			raise HTTPException(
				status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
				detail=f"An unexpected error occurred. {str(err)}"
			) from err
   
   	##############################################################
	### Website Links
	##############################################################
	def website_links(
		self,
		url: str = Query(description="The URL of the website to fetch links from"),
		depth: int = Query(default=1, max=2, description="Recursion depth for fetching links from the website"),
	):
		try:
			result = fetch_links(url, depth)
			return UJSONResponse(
				content={'links': sorted(list(result))},
				media_type='application/json',
				status_code=status.HTTP_200_OK
			)
		except HTTPException as err:
			logging.error(err.detail)
			raise
		except BaseException as err:
			tb = traceback.format_exc()
			logging.error(f"[controllers.{PathLib(__file__).resolve().stem}.website_links]: %s\n%s", err, tb)
			raise HTTPException(
				status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
				detail=f"An unexpected error occurred. {str(err)}"
			) from err
   
   	##############################################################
	### Collect Documents From Files
	##############################################################
	async def from_files(
		self,
		files: List[UploadFile] = File(...),
		splitter: str = Form(...),
		chunk_size: int = Form(default=1000),
		chunk_overlap: int = Form(default=100),
  		task_id: str = Form(...),
	):
		# Create a list to store the loaders
		loaders = []

		with tempfile.TemporaryDirectory() as tmpdirname:
			# Create a temporary directory to store the files
			for file in files:
				loader = loader_file_config(file, tmpdirname)
				loaders.append(loader)		
				
			try:
				documents = await self.document_service.from_loaders(
					loaders=loaders, 
					splitter=Splitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap, type=splitter),
					task_id=task_id
				)
				return UJSONResponse(
					content={
						'count': len(documents),
						'documents': list(map(lambda x: dict(x), documents))    
					},
					media_type='application/json',
					status_code=status.HTTP_200_OK
				)
			except HTTPException as err:
				logging.error(err.detail)
				raise
			except BaseException as err:
				tb = traceback.format_exc()
				logging.error(f"[routes.{PathLib(__file__).resolve().stem}.from_files]: %s\n%s", err, tb)
				raise HTTPException(
					status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
					detail=f"An unexpected error occurred. {str(err)}"
				) from err
   
   	##############################################################
	### Upsert Documents
	##############################################################
	async def upsert_documents(
		self,
		request: Request,
		body: UpsertDocuments = Body(...)
	):
		try:
			# Initialize the set for excluded keys
			excluded_from_defaults = {"REDIS_URL"}

			# Define the set of default keys
			default_keys = {"PINECONE_API_KEY", "PINECONE_ENV", "PINECONE_INDEX", "OPENAI_API_KEY", "REDIS_URL"}
   
			if body.provider == 'redis':
				keys = default_keys - {"PINECONE_API_KEY", "PINECONE_ENV", "PINECONE_INDEX"}
			elif body.provider == 'pinecone':
				keys = default_keys - excluded_from_defaults
			else:
				raise HTTPException(
					status_code=400,
					detail=f"Invalid retrieval provider: {body.provider}"
				)

			tokens = retrieve_defaults(keys)

			result = await self.document_service.upsert(
				body, 
				tokens, 
				keys,
				request.state.user_id
			)
			return UJSONResponse(
				content={'message': f'Documents upserted to [{body.index_name}] successfully.'},
				media_type='application/json',
				status_code=status.HTTP_200_OK
			)
		except HTTPException as err:
			logging.error(err.detail)
			raise
		except BaseException as err:
			tb = traceback.format_exc()
			logging.error(f"[routes.{PathLib(__file__).resolve().stem}.upsert_documents]: %s\n%s", err, tb)
			raise HTTPException(
				status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
				detail=f"An unexpected error occurred. {str(err)}"
			) from err