from typing import List
from pydantic import BaseModel, Field

class CopyPasteLoader(BaseModel):
	type: str = Field(...)
	text: str = Field(...)

class BlockchainLoader(BaseModel):
	type: str = Field(...)
	contract_address: str = Field(...)

class YoutubeLoader(BaseModel):
	type: str = Field(...)
	ytId: str = Field(...)

class TypeUrlLoader(BaseModel):
	type: str = Field(...)
	urls: List[str] = Field(...)
