import re
import httpx
import logging
from typing import Any, Dict, List, Type
from langchain.tools import StructuredTool
from langchain_core.pydantic_v1 import BaseModel, Field, create_model
from langchain_core.tools import ToolException
import asyncio


def get_field_type(field_type: str) -> Any:
    """
    Map field type strings to actual Python types.
    """
    type_mapping = {
        "str": str,
        "int": int,
        "float": float,
        "bool": bool,
        "dict": Dict[str, Any],
        "list": list
    }
    return type_mapping.get(field_type, Any)

def create_schema(model_name: str, fields_json: Dict[str, Any]) -> Type[BaseModel]:
    """
    Create a Pydantic model dynamically from a JSON object.

    :param model_name: The name of the model.
    :param fields_json: A dictionary representing the fields from a JSON object.
    :return: A dynamically created Pydantic model.
    """
    fields = {}
    for field_name, field_info in fields_json.items():
        field_type = get_field_type(field_info["type"])
        field_params = {"description": field_info.get("description", "")}
        if field_info.get("required", False):
            field_params["default"] = ...
        else:
            field_params["default"] = field_info.get("default", None)
        fields[field_name] = (field_type, Field(**field_params))
    
    return create_model(model_name, **fields)

async def api_request(
    url: str, 
    method: str, 
    headers: dict = None, 
    body: dict = None, 
    params: dict = None
):
    method = method.upper()
    async with httpx.AsyncClient() as client:
        if method == 'GET':
            response = await client.get(url, headers=headers, params=params)
        elif method == 'POST':
            response = await client.post(url, headers=headers, json=body, params=params)
        elif method == 'PUT':
            response = await client.put(url, headers=headers, json=body, params=params)
        elif method == 'DELETE':
            response = await client.delete(url, headers=headers, params=params)
        else:
            raise ToolException(f"Unsupported HTTP method: {method}")
        
        if 200 <= response.status_code < 300:
            logging.info(f"Request successful: {response.json()}")
            return response.json()
        elif 400 <= response.status_code < 500:
            raise ToolException(f"Invalid request: {response.status_code} {response.text}")
        else:
            logging.error(f"Error in request: {response.status_code} {response.text}")
            raise ToolException(f"Error: {response.status_code} {response.text}")

def sync_api_request(url: str, method: str, headers: dict = None, body: dict = None, params: dict = None):
    return asyncio.run(api_request(url, method, headers, body, params))

def endpoint_config(name: str, endpoints: List[dict]) -> dict:
    return next((endpoint for endpoint in endpoints if endpoint["name"] == name), None)

def get_endpoint(endpoint: dict) -> dict:
    return sync_api_request(endpoint["url"], endpoint["method"], endpoint["headers"], endpoint.get('body', None), endpoint.get('params', None))

def interpolate_url(url: str, params: dict) -> str:
    """
    Interpolates URL with parameters.

    :param url: The URL string with placeholders.
    :param params: Dictionary of parameters to replace placeholders.
    :return: Interpolated URL.
    """
    placeholders = re.findall(r'\{(\w+)\}', url)
    for placeholder in placeholders:
        if placeholder in params:
            url = url.replace(f'{{{placeholder}}}', str(params.pop(placeholder)))
    return url

def construct_api_tool(
    name: str, 
    endpoints: List[dict] = None,
) -> StructuredTool:
    
    config = endpoint_config(name, endpoints)
    if not config:
        raise Exception(f"Invalid endpoint: {name}")
    
    args = config.get("args", None) if config.get("args", None) != {} else None
    description = config.get("description")
    
    if args:
        args = create_schema(name+"_schema", args)

    # Define a wrapper function to be used as the callable
    def endpoint_func(**kwargs):
        url = interpolate_url(config["url"], kwargs)
        
        # Pass remaining kwargs as the body to the request
        return sync_api_request(
            url=url,
            method=config["method"],
            headers=config["headers"],
            body=kwargs,  # Use kwargs as the body
            params=config.get('params', None)
        )

    return StructuredTool.from_function(
        name=name,
        func=endpoint_func,  # Pass the wrapper function here
        description=description,
        args_schema=args,
        handle_tool_error=True,
    )
