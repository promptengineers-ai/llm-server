# Advanced Tools

## [SearxNG Search](https://api.python.langchain.com/en/latest/utilities/langchain_community.utilities.searx_search.SearxSearchWrapper.html)

The `searxng_search_tool` tool is a meta-search engine that aggregates the results of various search engines while not storing information about its users. This tool provides a way to perform searches using the SearxSearchWrapper and retrieve results from multiple search engines.

### Schema

```python
class SearxNGSchema(BaseModel):
    query: str = Field(..., description="The query to search for")
    num_results: int = Field(10, description="The number of results to return")
    engines: list = Field(None, description="The search engines to use")
    categories: List[Literal['web', 'images', 'videos']] = Field(None, description="The categories to search in")
    language: str = Field('en', description="The language to use")
```

### Configuration

```python
searxng_search_tool = StructuredTool.from_function(
    args_schema=SearxNGSchema,
    name="searxng_search",
    func=searxng_search,
    handle_tool_error=True,
    description="""
    SearxNG is a meta-search engine, aggregating the results of other search engines while not storing information about its users.
    """
)
```

### Function

```python
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
...

