from langchain_core.pydantic_v1 import BaseModel as LC_BaseModel, Field as LC_Field
from .api import APITool

class HumanQuery(LC_BaseModel):
    images: list[str] = LC_Field(
        description="The is a base64 string or url list of images to be processed."
    )

__all__ = ["HumanQuery", "APITool"]