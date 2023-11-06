"""Storage Service using MinIO"""
import os
from minio import Minio
from minio.error import S3Error

from server.config import S3_REGION, MINIO_SERVER
from server.utils import logger


class StorageService:
    """Storage Service Class for MinIO"""
    def __init__(self, access_key_id, secret_access_key, minio_server: str = None):
        self.minio_server = minio_server if minio_server else (MINIO_SERVER or f"s3.{S3_REGION}.amazonaws.com")
        self.access_key_id = access_key_id
        self.secret_access_key = secret_access_key
        self.client = Minio(
            endpoint=self.minio_server,
            access_key=self.access_key_id,
            secret_key=self.secret_access_key,
            secure=False if MINIO_SERVER or minio_server else True
        )

    def retrieve_all_files_raw(self, bucket: str, prefix: str = ''):
        """Retrieve all file details from a bucket"""
        files = []
        try:
            objects = self.client.list_objects(bucket, prefix=prefix, recursive=True)
            for obj in objects:
                files.append(obj)
        except S3Error as err:
            logger.error(f"Error retrieving files: {err}")
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
            logger.error(f"Error retrieving filenames: {err}")
        return files

    def retrieve_file(self, bucket: str, path: str):
        """Retrieve a file from a bucket"""
        try:
            response = self.client.get_object(bucket, path)
            return response.data
        except S3Error as err:
            logger.error(f"Error retrieving file {path}: {err}")
            return None

    def delete_file(self, bucket: str, path: str):
        """Delete a file from a bucket"""
        try:
            self.client.remove_object(bucket, path)
        except S3Error as err:
            logger.error(f"Error deleting file {path}: {err}")
            raise ValueError(f"Failed to delete file: {err}") from err

    def upload_file(self, file_name, bucket, object_name=None):
        """Upload a file to a MinIO bucket

        :param file_name: File to upload
        :param bucket: Bucket to upload to
        :param object_name: MinIO object name. If not specified then file_name is used
        :return: True if file was uploaded, else False
        """

        if object_name is None:
            object_name = os.path.basename(file_name)

        try:
            with open(file_name, 'rb') as file_data:
                file_stat = os.stat(file_name)
                self.client.put_object(
                    bucket, object_name, file_data, file_stat.st_size
                )
        except S3Error as err:
            logger.error(f"Error uploading file {file_name}: {err}")
            return False
        return True
