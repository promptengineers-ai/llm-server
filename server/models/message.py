from pydantic import BaseModel, Field

class SystemMessage(BaseModel):
	"""A message from the system."""
	role: str = Field(example='system')
	content: str = Field(example='You are a helpful assistant.')

class UserMessage(BaseModel):
	"""A message from the user."""
	role: str = Field(example='user')
	content: str = Field(example='Who won the 2001 world series?')

class AssistantMessage(BaseModel):
	"""A message from the assistant."""
	role: str = Field(example='assistant')
	content: str = Field(example='The arizona diamondbacks won the 2001 world series.')