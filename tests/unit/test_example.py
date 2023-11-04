"""test example module."""
import unittest


class TestExampleCase(unittest.TestCase):
    
    # @unittest.skip("Example Test Case")
    def test_retrieve_files(self):
        """Test that the files are retrieved."""
        token = "test"
        assert token == "test"