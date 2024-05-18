"""test example module."""
import unittest


class TestExampleCase(unittest.TestCase):
    
    # @unittest.skip("Example Test Case")
    def test_example(self):
        token = "test"
        assert token == "test"