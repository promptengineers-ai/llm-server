from typing import List, Optional
import os
import time
import pickle
import tempfile
from queue import Queue
from concurrent.futures import ThreadPoolExecutor

from fastapi import HTTPException, UploadFile, File
from langchain.embeddings.openai import OpenAIEmbeddings

from server.enums import FileLoaderType
from server.config.test import TEST_USER_ID
from server.factories.loader_factory import LoaderFactory
from server.repos.user import UserRepo
from server.services.redis import RedisService
from server.services.pinecone import PineconeService
from server.services.storage import StorageService
from server.utils import logger
from server.utils.validation import Validator
from server.utils.vectorstores import create_faiss_vectorstore

validator = Validator()
user_repo = UserRepo()

##############################################################
### Process File
##############################################################
def process_file(
    vectrostore_name: str,
    tmpdirname: str,
    file: UploadFile,
    embeddings: OpenAIEmbeddings,
    pinecone_service: PineconeService,
):
	try:
		file_path = os.path.join(tmpdirname, file.filename)
		_, file_extension = os.path.splitext(file.filename)
		file_extension_cleaned = file_extension.replace('.', '')

		# Check if the file extension is a valid type
		if file_extension_cleaned not in [e.value for e in FileLoaderType]:
			raise HTTPException(status_code=400, detail=f"Invalid file type: {file_extension_cleaned}")

		with open(file_path, 'wb') as f:
			f.write(file.file.read())  # write the file to the temporary directory
		doc_loader = LoaderFactory.create_loader(file_extension_cleaned, {'file_path': file_path})

		pinecone_service.from_documents([doc_loader], embeddings, namespace=vectrostore_name)
	except HTTPException:
		raise  # Re-raise the HTTPException without modifying it
	except Exception as e:
		raise HTTPException(status_code=400, detail=str(e)) from e

##############################################################
### Accumulate Files
##############################################################
def accumulate_files(files, user_id, tokens):
	collected_files = []
	for name in files:
		try:
			s3 = StorageService(tokens.get('ACCESS_KEY_ID'), tokens.get('ACCESS_SECRET_KEY'))
			file = s3.retrieve_file(
				path=f'users/{user_id}/files/{name}',
				bucket=tokens.get('BUCKET'),
			)
			collected_files.append(file)
		except Exception as err:
			logger.error(err)
			raise HTTPException(
				status_code=404, detail=f"File Not Found in S3: {str(name)}"
			) from err
	filtered_lst = [x for x in collected_files if x is not None]
	return filtered_lst

##############################################################
### Accumulate Loaders
##############################################################
def accumulate_loaders(body, files=None, tmpdirname=None):
	loaders = []
	for loader in dict(body).get('loaders', []):
		loader_type = loader.type
		loader_data = {}
		if loader_type == 'copy':
			loader_data = {'text': loader.text}
		elif loader_type == 'yt':
			loader_data = {'ytId': loader.ytId}
		elif loader_type == 'ethereum' or loader_type == 'polygon':
			loader_data = {'contract_address': loader.contract_address}
		else:
			loader_data = {'urls': loader.urls}

		doc_loader = LoaderFactory.create_loader(
			loader.type,
			loader_data
		)
		loaders.append(doc_loader)

	if tmpdirname:
		try:
			for file_body, name in zip(files, body.files):
				file_path = os.path.join(tmpdirname, name)
				with open(file_path, 'wb') as file:
					file.write(file_body.read())  # write the file to the temporary directory
				filename = file_path.split('/')[-1]
				loader = os.path.splitext(filename)[1][1:]
				doc_loader = LoaderFactory.create_loader(
					loader,
					{'file_path': file_path}
				)
				loaders.append(doc_loader)
		except Exception as err:
			logger.error(err)
			raise HTTPException(
				status_code=500,
				detail=f"Error creating loaders in tmp directory: {str(err)}"
			) from err
	return loaders

##############################################################
### Create a FAISS Vectorstore
##############################################################
def faiss_vectorstore(loaders, tmpdirname, user_id, name, tokens):
	documents = []
	for loader in loaders:
		documents.extend(loader.load())
	logger.info("[main.load_vectorstore_from_file] Loaders: %s", str(len(loaders)))
	logger.info("[main.load_vectorstore_from_file] Documents: %s", str(len(documents)))
	vectorstore = create_faiss_vectorstore(documents)
	## Save Vectorstore to tmp directory
	temp_file_path = os.path.join(tmpdirname, f'{int(time.time())}-{name}.pkl')
	try:
		## Write to temp file
		with open(temp_file_path, "wb") as file:
			pickle.dump(vectorstore, file)

		s3 = StorageService(tokens.get('ACCESS_KEY_ID'), tokens.get('ACCESS_SECRET_KEY'))
		# Save to S3
		file = s3.upload_file(
			file_name=temp_file_path,
			bucket=tokens.get('BUCKET'),
			object_name=f'users/{user_id}/vectorstores/{name}.pkl'
		)
	except Exception as err:
		raise HTTPException(
			status_code=500,
			detail=f"Error saving vectorstore in tmp directory: {str(err)}"
		) from err
	finally:
		with os.scandir(tmpdirname) as entries:
			for entry in entries:
				os.remove(entry.path)


class VectorSearchController:
	def __init__(self):
		# Initialize any necessary variables or objects here
		self.data = {}

	##############################################################
	### Create multi loader vectorstore
	##############################################################
	async def create_multi_loader_vectorstore(self, body, user_id = TEST_USER_ID):
		"""Create a vectorstore from multiple loaders."""
		passed_file_names = dict(body).get('files', [])
		pinecone_keys = ['PINECONE_KEY', 'PINECONE_ENV', 'PINECONE_INDEX', 'OPENAI_API_KEY']
		redis_keys = ['REDIS_URL', 'OPENAI_API_KEY']

		if not passed_file_names:
			if dict(body).get('provider') == 'pinecone':
				tokens = user_repo.find_token(user_id, pinecone_keys)
				validator.validate_api_keys(tokens, pinecone_keys)
				embeddings = OpenAIEmbeddings(openai_api_key=tokens.get('OPENAI_API_KEY'))
				pinecone_service = PineconeService(
					api_key=tokens.get('PINECONE_KEY'),
					env=tokens.get('PINECONE_ENV'),
					index_name=tokens.get('PINECONE_INDEX'),
				)
				loaders = accumulate_loaders(body)
				pinecone_service.from_documents(
					loaders,
					embeddings,
					namespace=dict(body).get('index_name')
				)

			if dict(body).get('provider') == 'redis':
				tokens = user_repo.find_token(user_id, redis_keys)
				validator.validate_api_keys(tokens, redis_keys)
				redis_service = RedisService(
					openai_api_key=tokens.get('OPENAI_API_KEY'),
					redis_url=tokens.get('REDIS_URL'),
					index_name=dict(body).get('index_name'),
				)
				loaders = accumulate_loaders(body)
				redis_service.from_documents(loaders)
		else:
			aws_keys = ['ACCESS_KEY_ID', 'ACCESS_SECRET_KEY', 'BUCKET']
			tokens = user_repo.find_token(user_id, [*pinecone_keys, *aws_keys])
			validator.validate_api_keys(tokens, [*pinecone_keys, *aws_keys])
			# Accumulate Files
			files = accumulate_files(passed_file_names, user_id, tokens)

			# Create a temporary directory
			with tempfile.TemporaryDirectory() as tmpdirname:

				# Your logic here to save uploaded files to tmpdirname
				loaders = accumulate_loaders(body, files, tmpdirname)

				if dict(body).get('provider') == 'faiss':
					faiss_vectorstore(loaders, tmpdirname, user_id, dict(body).get('index_name'), tokens)

				if dict(body).get('provider') == 'pinecone':
					embeddings = OpenAIEmbeddings(openai_api_key=tokens.get('OPENAI_API_KEY'))
					pinecone_service = PineconeService(
						api_key=tokens.get('PINECONE_KEY'),
						env=tokens.get('PINECONE_ENV'),
						index_name=tokens.get('PINECONE_INDEX'),
					)
					pinecone_service.from_documents(loaders, embeddings, namespace=dict(body).get('index_name'))

				if dict(body).get('provider') == 'redis':
					tokens = user_repo.find_token(user_id, redis_keys)
					validator.validate_api_keys(tokens, redis_keys)
					redis_service = RedisService(
						openai_api_key=tokens.get('OPENAI_API_KEY'),
						redis_url=tokens.get('REDIS_URL'),
						index_name=dict(body).get('index_name'),
					)
					loaders = accumulate_loaders(body)
					redis_service.from_documents(loaders)

	##############################################################
	### Create a Vectorstore from files
	##############################################################
	async def create_vectorstore_from_files(
		self,
		user_id: str,
		vectrostore_name: str,
		files: Optional[List[UploadFile]] = File(...),
		threaded: bool = True,
	):
		"""Create a vectorstore from files."""
		# Validate the file extensions before processing
		for file in files:
			_, file_extension = os.path.splitext(file.filename)
			file_extension_cleaned = file_extension.replace('.', '')

			# Check if the file extension is a valid type
			if file_extension_cleaned not in [e.value for e in FileLoaderType]:
				raise HTTPException(status_code=400, detail=f"Invalid file type: {file_extension_cleaned}")

		## Get Tokens
		keys = ['PINECONE_KEY', 'PINECONE_ENV', 'PINECONE_INDEX', 'OPENAI_API_KEY']
		tokens = user_repo.find_token(user_id, keys)
		## Check for token, else throw error
		validator.validate_api_keys(tokens, keys)

		## Get Embeddings and Pinecone Service
		embeddings = OpenAIEmbeddings(openai_api_key=tokens.get('OPENAI_API_KEY'))
		pinecone_service = PineconeService(
			api_key=tokens.get('PINECONE_KEY'),
			env=tokens.get('PINECONE_ENV'),
			index_name=tokens.get('PINECONE_INDEX'),
		)

		## Create a temporary directory
		with tempfile.TemporaryDirectory() as tmpdirname:
			# Your logic here to save uploaded files to tmpdirname
			if threaded:
				file_queue = Queue()
				for file in files:
					file_queue.put(file)

				def worker():
					while not file_queue.empty():
						file = file_queue.get()
						try:
							process_file(vectrostore_name, tmpdirname, file, embeddings, pinecone_service)
						finally:
							file_queue.task_done()

				with ThreadPoolExecutor() as executor:
					num_workers = min(len(files), os.cpu_count())  # You can adjust the number of workers
					for _ in range(num_workers):
						executor.submit(worker)

				file_queue.join()  # Wait for all files to be processed
			else:
				for file in files:
					process_file(vectrostore_name, tmpdirname, file, embeddings, pinecone_service)


	##############################################################
	### Retrieve Pinecone Vectorstores
	##############################################################
	def retrieve_pinecone_vectorstores(self, user_id: str):
		## Get Tokens
		keys = ['PINECONE_KEY', 'PINECONE_ENV', 'PINECONE_INDEX']
		tokens = user_repo.find_token(user_id, keys)
		## Check for token, else throw error
		validator.validate_api_keys(tokens, keys)
		## Get Vectorstores
		pinecone_service = PineconeService(
			api_key=tokens.get('PINECONE_KEY'),
			env=tokens.get('PINECONE_ENV'),
			index_name=tokens.get('PINECONE_INDEX'),
		)
		index_stats = pinecone_service.describe_index_stats()
		namespaces = index_stats.get('namespaces')

		return {
			'vectorstores': list(namespaces.keys()),
		}

	##############################################################
	### Delete Pinecone Vectorstore
	##############################################################
	def delete_pinecone_vectorstore(self, prefix: str, user_id: str):
		## Get Tokens
		keys = ['PINECONE_KEY', 'PINECONE_ENV', 'PINECONE_INDEX']
		tokens = user_repo.find_token(user_id, keys)
		## Check for token, else throw error
		validator.validate_api_keys(tokens, keys)
		## Delete Vectorstore
		pinecone_service = PineconeService(
			api_key=tokens.get('PINECONE_KEY'),
			env=tokens.get('PINECONE_ENV'),
			index_name=tokens.get('PINECONE_INDEX'),
		)
		deleted = pinecone_service.delete(namespace=prefix)
		if deleted:
			return True
		else:
			return False
