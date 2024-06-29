from langchain_community.utilities import SearxSearchWrapper

from src.config.tool import SEARX_SEARCH_HOST_URL

def searx_search(
    query: str, 
    num_results: int = 5, 
    engines: list = None,
    categories: list = None,
    language: str = None, 
):
    searx = SearxSearchWrapper(searx_host=SEARX_SEARCH_HOST_URL)
    results = searx.results(
        query=query,
        num_results=num_results,
        engines=engines,
        categories=categories,
        language=language
    )
    return results