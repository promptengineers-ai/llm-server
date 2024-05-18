"""Storage Service using MinIO"""
import os
import logging
import datetime
import threading
import mimetypes
from fastapi import UploadFile
from minio import Minio
from minio.error import S3Error

from src.config import MINIO_HOST, S3_REGION

class StorageService:
	"""Storage Service Class for MinIO"""
	_instance = None

	def __new__(cls, *args, **kwargs):
		if not cls._instance:
			cls._instance = super(StorageService, cls).__new__(cls)
		return cls._instance

	def __init__(self, access_key_id, secret_access_key, minio_server: str = None):
		self.minio_server = minio_server if minio_server else (MINIO_HOST or f"s3.{S3_REGION}.amazonaws.com")
		self.access_key_id = access_key_id
		self.secret_access_key = secret_access_key
		self.client = Minio(
			endpoint=self.minio_server,
			access_key=self.access_key_id,
			secret_key=self.secret_access_key,
			secure=False if MINIO_HOST else True,
		)

	def retrieve_all_files_raw(self, bucket: str, prefix: str = ''):
		"""Retrieve all file details from a bucket"""
		files = []
		try:
			objects = self.client.list_objects(bucket, prefix=prefix, recursive=True)
			for obj in objects:
				files.append(obj)
		except S3Error as err:
			logging.error("Error retrieving files: %s", err)
		return files

	def retrieve_all_files(self, bucket: str, prefix: str = ''):
		"""Retrieve all filenames from a bucket"""
		files = []
		try:
			objects = self.client.list_objects(bucket, prefix=prefix, recursive=True)
			for obj in objects:
				filename = obj.object_name.split('/')[-1]
				if filename:
					files.append(filename)
		except S3Error as err:
			logging.error("Error retrieving filenames: %s", err)
		return files

	def retrieve_file(self, bucket: str, path: str):
		"""Retrieve a file from a bucket"""
		try:
			response = self.client.get_object(bucket, path)
			return response.data
		except S3Error as err:
			logging.error("Error retrieving file %s: %s", path, err)
			return None

	def delete_file(self, bucket: str, path: str):
		"""Delete a file from a bucket"""
		try:
			self.client.remove_object(bucket, path)
		except S3Error as err:
			logging.error("Error deleting file %s: %s", path, err)
			raise ValueError(f"Failed to delete file: {err}") from err

	def upload_file(self, upload_file: UploadFile, bucket, directory=None, object_name=None):
		"""Upload a file to a MinIO bucket asynchronously with appropriate content type

		:param upload_file: FastAPI UploadFile object from request
		:param bucket: Bucket to upload to
		:param object_name: MinIO object name. If not specified then the upload_file's filename is used
		:return: Thread handling the upload to track completion.
		"""
		if object_name is None:
			object_name = upload_file.filename

		# Determine the MIME type
		content_type, _ = mimetypes.guess_type(upload_file.filename)
		if content_type is None:
			content_type = 'application/octet-stream'  # Default MIME type if unknown
   
		# Prepend directory to object name if specified
		object_name = os.path.join(directory, object_name) if directory else object_name

		def upload_action():
			try:
				with upload_file.file as file_data:
					file_stat = os.fstat(file_data.fileno())
					self.client.put_object(
						bucket, object_name, file_data, file_stat.st_size,
						content_type=content_type
					)
					logging.info(f"Successfully uploaded {upload_file.filename} to {object_name}")
			except S3Error as err:
				logging.error("Error uploading file %s: %s", upload_file.filename, err)

		thread = threading.Thread(target=upload_action)
		thread.start()
		return thread

	def upload_files(self, files, bucket, prefix=None):
		"""Upload multiple files concurrently.

		:param files: List of file paths to upload
		:param bucket: Bucket to upload to
		"""
		threads = []
		for file_name in files:
			extension = os.path.splitext(file_name.filename)[1].lower()
			directory = f"{prefix}/{extension.strip('.')}" if prefix else extension.strip('.')

			thread = self.upload_file(file_name, bucket, directory=directory)
			threads.append(thread)
		
		for thread in threads:
			thread.join()
   
		return [{"filename": file.filename, "size":file.size, "content_type": file.content_type} for file in files]
   
	def create_presigned_urls(self, bucket, object_names, expiration=3600, response_content_type=None, inline=True):
		"""
		Generate presigned URLs for a list of objects, optionally setting response content type and disposition.

		:param bucket: The name of the bucket.
		:param object_names: List of object names in the bucket.
		:param expiration: The expiration time in seconds (default is 3600 seconds, or 1 hour).
		:param response_content_type: Optional override for 'Content-Type' on response.
		:param inline: Whether to set 'Content-Disposition' to 'inline' or 'attachment'.
		:return: Dictionary of object names to their presigned URLs or None if an error occurs.
		"""
		urls = {}
		expiration_delta = datetime.timedelta(seconds=expiration)
		for object_name in object_names:
			response_headers = {}
			if response_content_type:
				response_headers['response-content-type'] = response_content_type
			if inline:
				response_headers['response-content-disposition'] = 'inline'
			else:
				response_headers['response-content-disposition'] = 'attachment'

			try:
				url = self.client.presigned_get_object(
					bucket, 
     				object_name, 
         			expires=expiration_delta,
					response_headers=response_headers
				)
				if url:
					urls[object_name] = url
			except S3Error as err:
				logging.error(f"Error generating presigned URL for {object_name}: {err}")
				continue
		return urls