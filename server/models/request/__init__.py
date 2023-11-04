"""Request Models"""
from typing import Any, List, Optional, Union
from pydantic import BaseModel, Field

from server.models.loaders import (
    TypeUrlLoader,
    YoutubeLoader,
    BlockchainLoader,
    CopyPasteLoader,
)
from server.config.messages import FUNCTION_MESSAGES


#################################################
## ChatGPT
#################################################
class ReqBodyChat(BaseModel):  # pylint: disable=too-few-public-methods
    """A message to send to the chatbot."""

    title: Optional[str] = None
    model: Optional[str] = None
    messages: Optional[Any] = None
    temperature: Optional[float or int] = None
    stream: Optional[bool] = None

    class Config:  # pylint: disable=too-few-public-methods
        """A message to send to the chatbot."""

        json_schema_extra = {
            "example": {
                "model": "gpt-3.5-turbo",
                "temperature": 0.8,
                "stream": False,
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "Who won the 2001 world series?"},
                    {
                        "role": "assistant",
                        "content": "The arizona diamondbacks won the 2001 world series.",
                    },
                    {"role": "user", "content": "Who were the pitchers?"},
                ],
            }
        }


class ReqBodyAgentChat(ReqBodyChat):  # pylint: disable=too-few-public-methods
    """A message to send to the chatbot."""

    tools: list[str] = None

    class Config:  # pylint: disable=too-few-public-methods
        """A message to send to the chatbot."""

        json_schema_extra = {
            "example": {
                "model": "gpt-3.5-turbo",
                "temperature": 0.8,
                "stream": False,
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {
                        "role": "user",
                        "content": "What will $2000 compounded at 5 percent for 10 years be?",
                    },
                ],
                "tools": ["math_tool"],
            }
        }


class ReqBodyAgentPluginsChat(ReqBodyChat):  # pylint: disable=too-few-public-methods
    """A message to send to the chatbot."""

    plugins: list[str] = None

    class Config:  # pylint: disable=too-few-public-methods
        """A message to send to the chatbot."""

        json_schema_extra = {
            "example": {
                "model": "gpt-3.5-turbo-16k",
                "temperature": 0.8,
                "stream": False,
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {
                        "role": "user",
                        "content": "Using the Speak tool, how should I politely greet shop employees when I enter, in French?",
                    },
                ],
                "plugins": ["https://api.speak.com/.well-known/ai-plugin.json"],
            }
        }


class ReqBodyVectorstoreChat(ReqBodyChat):  # pylint: disable=too-few-public-methods
    """A message to send to the chatbot."""

    vectorstore: Optional[str] = None
    provider: Optional[str] = None

    class Config:  # pylint: disable=too-few-public-methods
        """A message to send to the chatbot."""

        json_schema_extra = {
            "example": {
                "provider": "pinecone",
                "vectorstore": "Formio",
                "model": "gpt-3.5-turbo",
                "temperature": 0.8,
                "stream": False,
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "Can you summarize the context?"},
                ],
            }
        }


class ReqBodyFunctionChat(ReqBodyChat):  # pylint: disable=too-few-public-methods
    """A message to send to the chatbot."""

    functions: list[str] = []

    class Config:  # pylint: disable=too-few-public-methods
        """A message to send to the chatbot."""

        json_schema_extra = {
            "example": {
                "model": "gpt-3.5-turbo",
                "temperature": 0.8,
                "messages": FUNCTION_MESSAGES,
                "functions": ["get_word_length"],
            }
        }


class RequestMultiLoader(BaseModel):
    index_name: str = Field(...)
    provider: str = ("pinecone", "redis")
    files: List[str] or None = Field(...)
    loaders: List[
        Union[TypeUrlLoader, YoutubeLoader, BlockchainLoader, CopyPasteLoader]
    ] or None = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "provider": "pinecone",
                "index_name": "formio-docs-and-website",
                "files": [
                    "formio-customer-issue.pdf",
                ],
                "loaders": [
                    {"type": "gitbook", "urls": ["https://help.form.io"]},
                    {"type": "web_base", "urls": ["https://form.io"]},
                ],
            }
        }


class RequestDataLoader(BaseModel):
    index_name: str = Field(...)
    provider: str = ("pinecone", "redis")
    loaders: List[
        Union[TypeUrlLoader, YoutubeLoader, BlockchainLoader, CopyPasteLoader]
    ] or None = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "provider": "pinecone",
                "index_name": "formio-docs-and-website",
                "loaders": [
                    {"type": "gitbook", "urls": ["https://help.form.io"]},
                    {"type": "web_base", "urls": ["https://form.io"]},
                    {"type": "copy", "text": "This is a test."},
                ],
            }
        }

class ReqBodyChatHistory(ReqBodyChat): # pylint: disable=too-few-public-methods
	"""A message to send to the chatbot."""
	title: Optional[str] = None

	class Config: # pylint: disable=too-few-public-methods
		"""A message to send to the chatbot."""
		json_schema_extra = {
			"example": {
				"title": "World Series 2001 Chatbot",
				"model": "gpt-3.5-turbo",
				"temperature": 0.8,
				"stream": False,
				"messages": [
					{"role": "system", "content": "You are a helpful assistant."},
					{"role": "user", "content": 'Who won the 2001 world series?'},
					{"role": "assistant", "content": 'The arizona diamondbacks won the 2001 world series.'},
					{"role": "user", "content": 'Who were the pitchers?'},
				]
			}
		}

class ReqBodyListChatHistory(ReqBodyChatHistory): # pylint: disable=too-few-public-methods
	"""A message to send to the chatbot."""

	class Config: # pylint: disable=too-few-public-methods
		"""A message to send to the chatbot."""
		json_schema_extra = {
			"example": {
				"chats": [
					{
						"_id": "653e147a126c8e67d951fd20",
						"title": "World Series 2001 Chatbot",
						"model": "gpt-3.5-turbo",
						"temperature": 0.8,
						"stream": False,
						"messages": [
							{"role": "system", "content": "You are a helpful assistant."},
							{"role": "user", "content": 'Who won the 2001 world series?'},
							{"role": "assistant", "content": 'The arizona diamondbacks won the 2001 world series.'},
							{"role": "user", "content": 'Who were the pitchers?'},
						],
						"functions": [],
						"vectorstore": "",
						"user_id": "63f0962f9a09c84c98ab6caf",
						"created_at": 1698523723,
						"updated_at": 1698562747
					},
					{
						"_id": "6539f7f3126c8e67d951fc77",
						"temperature": 0.9,
						"model": "gpt-3.5-turbo",
						"messages": [
							{
								"role": "system",
								"content": "PERSONA:\nImagine you super intelligent AI assistant that is an expert on the context.\n\nINSTRUCTION:\nUse the following pieces of context to answer the question at the end. If you don't know the answer or if the required code is not present, just say that you don't know, and don't try to make up an answer. \n\nOUTPUT FORMAT RULES:\nCode snippets should be wrapped in triple backticks, along with the language name for proper formatting,  if applicable. This also includes yaml and Dockerfile's. If showing how to install dependencies like npm, pip, cargo, etc use the bash backticks.\nExample:\n```python\nprint(\"Hello World!\")\n```"
							},
							{
								"role": "user",
								"content": "Can you summarize the readme on chat-extension repository "
							},
							{
								"role": "assistant",
								"content": "I'm sorry, but I couldn't find the README for the chat-extension repository."
							}
						],
						"tools": [
							"github_get_repository",
							"github_list_organization_repos",
							"github_issues_assigned_to_auth_user",
							"github_repo_issue",
							"github_repo_issue_create",
							"github_repo_issue_update",
							"github_repo_pull_create"
						],
						"functions": [],
						"vectorstore": "",
						"user_id": "63f0962f9a09c84c98ab6caf",
						"created_at": 1698297843,
						"updated_at": 1698297843
					}
				]
			}
		}
