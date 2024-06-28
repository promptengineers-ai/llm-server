import unittest
import tempfile
import os
from fastapi import UploadFile

from src.config import BUCKET, ACCESS_KEY_ID, ACCESS_SECRET_KEY
from src.services.storage import StorageService

class TestUploadFile(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.storage_service = StorageService(access_key_id=ACCESS_KEY_ID, 
                                            secret_access_key=ACCESS_SECRET_KEY)
        cls.temp_files = [tempfile.NamedTemporaryFile(delete=False, suffix='.txt', mode='w+b') for _ in range(3)]
        
        # Write some data to temporary files
        for temp in cls.temp_files:
            temp.write(b'Test data')
            temp.flush()  # Flush data to disk without closing
            # No need to close here; will close after upload in tearDownClass

        # Upload the files once for all tests to use
        threads = []
        for temp in cls.temp_files:
            thread = cls.storage_service.upload_file(temp.name, BUCKET)
            threads.append(thread)
        for thread in threads:
            thread.join()

        # Retrieve file list once for all tests
        cls.files = cls.storage_service.retrieve_all_files(BUCKET)
        
    @classmethod
    def tearDownClass(cls):
        """Clean up temporary files."""
        for temp in cls.temp_files:
            temp.close()  # Ensure all temp files are closed here
            os.remove(temp.name)


    def test_upload_multiple_files(self):
        """Test that files are uploaded. This should be modified to check if files exist."""
        self.assertGreater(len(self.files), 0, "Files should be uploaded.")

    def test_retrieve_all_files_raw(self):
        """Test retrieving all files in raw format."""
        files = self.storage_service.retrieve_all_files_raw(BUCKET)
        self.assertIsNotNone(files, "Should retrieve files in raw format.")
        
    def test_retrieve_all_files(self):
        """Test retrieving all files."""
        self.assertIsNotNone(self.files, "Should retrieve all files.")

    # def test_retrieve_file(self):
    #     """Test retrieving a specific file."""
    #     found_file = self.storage_service.retrieve_file(BUCKET, self.files[-1])
    #     self.assertIsNotNone(found_file, "Should retrieve the specified file.")

    # def test_delete_file(self):
    #     """Test deleting a specific file."""
    #     found_file = self.storage_service.delete_file(BUCKET, self.files[-1])
    #     self.assertIsNotNone(found_file, "Should confirm file deletion.")
    
    def test_generate_presigned_url(self):
        if not self.files:
            self.fail("No files available to generate presigned URL.")
        file_to_test = self.files[0]
        presigned_url = self.storage_service.create_presigned_urls(BUCKET, [file_to_test], 3600)
        self.assertIsNotNone(presigned_url[file_to_test], "Presigned URL should be generated.")
        self.assertIsInstance(presigned_url[file_to_test], str, "Presigned URL should be a string.")
        self.assertTrue(presigned_url[file_to_test].startswith('http'), "Presigned URL should start with 'http'.")

        
    @classmethod
    def tearDownClass(cls):
        """Clean up temporary files."""
        for temp in cls.temp_files:
            os.remove(temp.name)

if __name__ == '__main__':
    unittest.main()