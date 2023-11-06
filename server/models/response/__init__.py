"""Response models for the API."""
from pydantic import BaseModel, Field

from server.models.response.http import (
    ResponseStatus,
    ResponseChat,
    ResponseAgentChat,
    ResponseAgentPluginsChat,
    ResponseVectorstoreChat,
    ResponseCreateVectorStore,
    ResponseListPineconeVectorStores,
)
from server.models.response.stream import (
    RESPONSE_STREAM_AGENT_CHAT,
    RESPONSE_STREAM_VECTORSTORE_CHAT,
    RESPONSE_STREAM_AGENT_PLUGINS_CHAT,
    RESPONSE_STREAM_CHAT,
)


class ResponseFileLoader(BaseModel):
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Vectorstore Created!",
                "vectorstore": "index_name",
            }
        }


class ResponseChatStream(BaseModel):
    """A message to send to the chatbot."""

    sender: str = Field(default="assistant")
    message: str = Field(default="Dialog started.")
    type: str = Field(default="stream")


class ResponseRetrieveVectorstores(BaseModel):
    """A message to send to the chatbot."""

    class Config:
        """A message to send to the chatbot."""

        json_schema_extra = {"example": {"vectorstores": ["promptengineers-ai.pkl", "bullmq.pkl"]}}


class ResponseRetrieveFiles(BaseModel):
    class Config:
        json_schema_extra = {
            "example": {
                "files": [
                    "A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT.pdf",
                    "ai-village.pdf",
                ]
            }
        }


class ResponseFileStorage(BaseModel):
    class Config:
        json_schema_extra = {
            "example": {
                "message": "File(s) Uploaded!",
                "bucket_name": "prompt-engineers-dev",
                "files": [
                    "standard-procedure.pdf",
                    "interview-questions.pdf",
                ],
            }
        }


__all__ = [
    "ResponseStatus",
    "ResponseChat",
    "ResponseAgentChat",
    "ResponseAgentPluginsChat",
    "ResponseVectorstoreChat",
    "RESPONSE_STREAM_AGENT_CHAT",
    "RESPONSE_STREAM_AGENT_PLUGINS_CHAT",
    "RESPONSE_STREAM_VECTORSTORE_CHAT",
    "RESPONSE_STREAM_CHAT",
    "ResponseCreateVectorStore",
    "ResponseListPineconeVectorStores",
]
