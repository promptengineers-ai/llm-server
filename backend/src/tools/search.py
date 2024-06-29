from langchain_core.tools import ToolException
from langchain_community.utilities import SearxSearchWrapper

from src.config.tool import SEARX_SEARCH_HOST_URL

def searx_search(
    query: str,  # The search query.
    num_results: int = 5,  # The number of results to return. Defaults to 5.
    engines: list = None,  # The list of search engines to use. Defaults to None.
    categories: list = None,  # The list of search categories to use. Defaults to None.
    language: str = None,  # The language to use for the search. Defaults to None.
) -> list:  # The search results.
    """
    Searches for results using the SearxSearchWrapper.

    Args:
        query (str): The search query.
        num_results (int, optional): The number of results to return. Defaults to 5.
        engines (list, optional): The list of search engines to use. Defaults to None.
        categories (list, optional): The list of search categories to use. Defaults to None.
        language (str, optional): The language to use for the search. Defaults to None.

    Returns:
        list: The search results.

    Raises:
        ToolException: If SEARX_SEARCH_HOST_URL is not provided.
    """
    # Check if SEARX_SEARCH_HOST_URL is provided.
    if not SEARX_SEARCH_HOST_URL:
        raise ToolException("No SEARX_SEARCH_HOST_URL provided")
    
    # Create a SearxSearchWrapper instance.
    searx = SearxSearchWrapper(searx_host=SEARX_SEARCH_HOST_URL)
    
    # Perform the search and return the results.
    results = searx.results(
        query=query,
        num_results=num_results,
        engines=engines,
        categories=categories,
        language=language
    )
    return results
