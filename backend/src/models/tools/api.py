from pydantic import BaseModel, Field, field_validator

class APITool(BaseModel):
    name: str = Field(..., description="The name of the tool.")
    description: str = Field(..., description="The description of the tool.")
    link: str = Field(..., description="The link to the tool.")
    toolkit: str = Field('API', description="The toolkit of the tool.")
    url: str = Field(..., description="The url of the tool.")
    method: str = Field('GET', description="The method of the tool.")
    headers: dict = Field({}, description="The headers of the tool.")
    args: dict = Field({}, description="The args of the tool.")
    
    @field_validator('name')
    def name_must_be_lowercase_and_underscores(cls, v):
        if not v.islower() or not all(c.isalnum() or c == '_' for c in v):
            raise ValueError("The name must be lowercase and can only contain letters, numbers, and underscores.")
        return v

    __config__ = {
		"json_schema_extra": {
            "examples": {
                "find_tool": {
                    "tool": {
                        "id": "29eb9eb5-018f-4635-9044-b6ea3fd1f054",
                        "name": "update_post_two",
                        "description": "To update an existing post.",
                        "link": "/tools/update_post",
                        "toolkit": "API",
                        "url": "https://jsonplaceholder.typicode.com/posts/{postId}",
                        "method": "PUT",
                        "args": {
                        "title": {
                            "type": "str",
                            "description": "The title of the post",
                            "required": True,
                            "default": "Updated Post"
                        },
                        "body": {
                            "type": "str",
                            "description": "The body content of the post",
                            "required": True
                        },
                        "userId": {
                            "type": "int",
                            "description": "The ID of the user creating the post",
                            "default": 1,
                            "required": True
                        },
                        "postId": {
                            "type": "string",
                            "description": "The ID of the post to be updated",
                            "required": True
                        }
                        },
                        "headers": {
                            "Content-Type": {
                                "value": "application/json; charset=UTF-8",
                                "encrypted": False
                            },
                            "x-api-key": {
                                "value": "abcdefghijklmndopqrstuvwxyz",
                                "encrypted": True
                            }
                        }
                    }
                },
                "update_tool": {
                    "tool": {
                        "value": "update_post",
                        "updated_at": "2024-08-11T02:21:53.477131"
                    }
                },
                "update_reqbody": {
                    "name": "update_post",
                    "description": "To update an existing post.",
                    "link": '/tools/update_post',
                    'toolkit': 'API',
                    "url": "https://jsonplaceholder.typicode.com/posts/{postId}",
                    "method": "PUT",
                    "headers": {
                        "Content-Type": {
                            "value":"application/json; charset=UTF-8",
                            "encrypted": False
                        },
                        "x-api-key": {
                            "value": "abcdefghijklmnopqrstuvwxyz",
                            "encrypted": True
                        }
                    },
                    "args": {
                        "title": {
                            "type": "str",
                            "description": "The title of the post",
                            "required": True,
                            "default": "Updated Post"
                        },
                        "body": {
                            "type": "str",
                            "description": "The body content of the post",
                            "required": True
                        },
                        "userId": {
                            "type": "int",
                            "description": "The ID of the user creating the post",
                            "default": 1,
                            "required": True
                        },
                        "postId": {
                            "type": "string",
                            "description": "The ID of the post to be updated",
                            "required": True
                        }
                    }
                }
            } 
        }
    }