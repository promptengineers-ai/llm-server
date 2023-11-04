"""Response models for the API.""" ""
from pydantic import BaseModel, Field


class ResponseStatus(BaseModel):
    """A message to send to the chatbot."""
    version: str = Field(default="v0.0.15")


#################################################
## Chat HTTP Response
#################################################
class ResponseChat(BaseModel):
    """A message to send to the chatbot."""

    class Config:  # pylint: disable=too-few-public-methods
        """A message to send to the chatbot."""

        json_schema_extra = {
            "example": {
				"message": "The pitchers for the Arizona Diamondbacks in the 2001 World Series were Randy Johnson, Curt Schilling, Miguel Batista, and Brian Anderson.",
				"usage": {
					"total_tokens": 80,
					"prompt_tokens": 50,
					"completion_tokens": 30,
					"total_cost": 0.000135,
					"successful_requests": 1
				}
			}
        }


#################################################
## Chat Agent HTTP Response
#################################################
class ResponseAgentChat(BaseModel):
    class Config:
        json_schema_extra = {
            "example": {
                "message": "$2000 compounded at 5 percent for 10 years will be approximately $3257.79.",
                "usage": {
                    "total_tokens": 245,
                    "prompt_tokens": 193,
                    "completion_tokens": 52,
                    "total_cost": 0.00039349999999999997,
                    "successful_requests": 2,
                },
            }
        }


#################################################
## Chat Agent Plugins HTTP Response
#################################################
class ResponseAgentPluginsChat(BaseModel):
    class Config:
        json_schema_extra = {
            "example": {
                "message": 'To politely greet shop employees when entering in French, you can say "Bonjour" which means "Hello" or "Good day" in English. It is a common and polite way to greet people in France.',
                "usage": {
                    "total_tokens": 13395,
                    "prompt_tokens": 13241,
                    "completion_tokens": 154,
                    "total_cost": 0.040339,
                    "successful_requests": 4,
                },
            }
        }


#################################################
## Chat Vectorstore HTTP Response
#################################################
class ResponseVectorstoreChat(BaseModel):
    class Config:
        json_schema_extra = {
            "example": {
                "message": "The context is about projects and their components. The components include forms, resources, submissions, actions, logs, access, revisions, settings, roles, stages, integrations, authentication, and stage versions and deployments. The main purpose of the context is to provide a sandbox for projects to manage and control various aspects of their operations. Additionally, users can introduce their own evaluation context variables to customize the evaluations within the projects.",
                "usage": {
                    "total_tokens": 537,
                    "prompt_tokens": 453,
                    "completion_tokens": 84,
                    "total_cost": 0.0008475,
                    "successful_requests": 1,
                },
            }
        }


#################################################
## Create Vectorstore HTTP Response
#################################################
class ResponseCreateVectorStore(BaseModel):
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Vectorstore Created!",
                "data": {
                    "name": "formio-docs-and-website",
                    "loaders": [
                        {"type": "gitbook", "urls": ["https://help.form.io"]},
                        {"type": "website", "urls": ["https://form.io"]},
                    ],
                },
            }
        }


#################################################
## List Vectorstores HTTP Response
#################################################
class ResponseListPineconeVectorStores(BaseModel):
    class Config:
        json_schema_extra = {
            "example": {"vectorstores": ["pinecone-docs-guide-and-api", "formio"]}
        }
