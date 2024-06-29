from langchain_core.pydantic_v1 import BaseModel, Field

class HumanQuery(BaseModel):
    images: list[str] = Field(
        description="The is a base64 string or url list of images to be processed."
    )
