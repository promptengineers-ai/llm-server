"""test example module."""
import unittest

from src.config.tool import ENDPOINTS
from src.tools.api import construct_api_tool

class TestApiTools(unittest.TestCase):
    
    @unittest.skip("Skip test_api_tool")
    def test_api_tool(self):
        tool = construct_api_tool(
            name='update_post',
            endpoints=ENDPOINTS
        )
        result = tool.run({
            "title": "Test",
            "body": "World",
            "postId": 1
        })
        print(result)