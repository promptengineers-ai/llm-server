import os
import tempfile
from typing import List, Optional

from fastapi import File, HTTPException, UploadFile

from server.config import ACCESS_KEY_ID, BUCKET, ACCESS_SECRET_KEY
from server.config.test import TEST_USER_ID
from server.services.storage import StorageService


class StorageController:
	def __init__(self):
		# Initialize any necessary variables or objects here
		self.data = {}

	def save_files_to_bucket(self, files: Optional[List[UploadFile]] = File(...), directory: str = 'files'):
		try:
			s3client = StorageService(
				ACCESS_KEY_ID,
				ACCESS_SECRET_KEY
			)
		except Exception as err:
			raise HTTPException(status_code=500, detail=str(err)) from err

		# Create a temporary directory
		with tempfile.TemporaryDirectory() as tmpdirname:
			uploaded_files = []
			for file in files:
				if directory != 'files':
					ext = os.path.splitext(file.filename)[1][1:]
					if ext != 'pkl':
						raise HTTPException(
							status_code=400,
							detail=f"File [{file.filename}] can NOT be uploaded, only .pkl files are allowed."
						)
				## Save File To Temp Directory
				file_path = os.path.join(tmpdirname, file.filename)
				try:
					with open(file_path, 'wb') as reader:
						reader.write(file.file.read())  # write the file to the temporary directory
				except Exception as err:
					raise HTTPException(
						status_code=500,
						detail=f"Error saving files to temporary directory: {str(err)}"
					) from err
				# Now upload each file in the temporary directory to s3
				try:
					for file_name in os.listdir(tmpdirname):
						file_path = os.path.join(tmpdirname, file_name)
						s3_file_path = f'users/{TEST_USER_ID}/{directory}/{file_name}'  # Add the desired prefix
						s3client.upload_file(
							file_path,
							BUCKET,
							s3_file_path
						)
						uploaded_files.append(file_name)
				except Exception as err:
					raise HTTPException(
						status_code=500,
						detail=f"Error uploading files to S3: {str(err)}"
					) from err
		return {
			"files": uploaded_files
		}

	def retrieve_files_from_bucket(self, directory: str = 'files'):
		s3client = StorageService(
			ACCESS_KEY_ID,
			ACCESS_SECRET_KEY
		)
		files = s3client.retrieve_all_files(
			BUCKET,
			f'users/{TEST_USER_ID}/{directory}'
		)
		return {
			f'{directory}': [] if not files else files
		}

	##############################################################
	### Delete File From Bucket
	##############################################################
	def delete_file_from_bucket(self, file_name: str):
		try:
			## Delete File
			s3client = StorageService(
				ACCESS_KEY_ID,
				ACCESS_SECRET_KEY
			)
			s3client.delete_file(
				BUCKET,
				f'users/{TEST_USER_ID}/files/{file_name}'
			)
		except Exception as err:
			raise HTTPException(
       			status_code=500,
          		detail=f"Error deleting file from S3: {str(err)}"
            ) from err
