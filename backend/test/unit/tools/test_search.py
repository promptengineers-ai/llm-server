"""test example module."""
import unittest
import pprint

from src.config import APP_LOG_LEVEL
from src.tools.search import searx_search

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