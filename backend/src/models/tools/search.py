from typing import List, Literal
from langchain_core.pydantic_v1 import BaseModel, Field

class SearxNgSchema(BaseModel):
    query: str = Field(..., description="The query to search for")
    num_results: int = Field(10, description="The number of results to return")
    engines: list = Field(None, description="The search engines to use")
    categories: List[Literal['web', 'images', 'videos']] = Field(None, description="The categories to search in")
    language: str = Field('en', description="The language to use")