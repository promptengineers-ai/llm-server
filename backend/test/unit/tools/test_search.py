"""test example module."""
import unittest
from unittest.mock import patch, MagicMock

import pprint

from src.config import APP_LOG_LEVEL
from src.tools.search import searx_search
from src.tools import searxng_serach_tool

class TestSearchTools(unittest.TestCase):
    
    @unittest.skip("Skip test_searx_search")
    def test_searx_search(self):
        query = "Plano Prompt Engineers"
        results = searx_search(
            query=query, 
            num_results=5,
            categories=["videos"],
        )
        if APP_LOG_LEVEL == "DEBUG":
            pprint.pprint(results)
        assert len(results) > 0
        assert type(results) == list
        
    # @unittest.skip("Skip test_searxng_serach_tool")
    def test_searxng_serach_tool(self):
        tool_input = {
            "query": "Plano Prompt Engineers",
            "num_results": 10,
            "categories": ["videos"],
        }
        tool = searxng_serach_tool
        results = tool.run(
            tool_input=tool_input
        )
        if APP_LOG_LEVEL == "DEBUG":
            pprint.pprint(tool.args)
            pprint.pprint(results)
        assert len(results) > 0
        assert type(results) == list