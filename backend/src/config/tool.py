import os
from src.models.tools import APITool
from src.tools import searx_search_tool, multi_modal_tool

## Configuration for tools
SEARX_SEARCH_HOST_URL = os.environ.get('SEARX_SEARCH_HOST_URL', None) ## If not set we want tool to error gracefully

## Tool descriptions
TOOL_DESCRIPTIONS = {
    'image_summary': {
        'description': 'Tool for understanding context in an image. Uses GPT-4o (currently).',
        'link': '/tools/image_summary',
        'toolkit': 'Advanced'
    },
    'searx_search': {
        'name': 'SearxNG Search',
        'description': searx_search_tool.description,
        'link': 'https://api.python.langchain.com/en/latest/utilities/langchain_community.utilities.searx_search.SearxSearchWrapper.html',
        'toolkit': 'Advanced'
    },
    'repl_tool': {
        'description': 'Python REPL can execute arbitrary code. Use with caution',
        'link': '/tools/repl_tool',
        'toolkit': 'Advanced'
    },
    'csv_tool': {
        'description': 'Tool for processing CSV files.',
        'link': '/tools/csv_tool',
        'toolkit': 'Basic'
    },
    'pdf_get_field_names': {
        'description': 'Extract field names from PDF forms.',
        'link': '/tools/pdf_get_field_names',
        'toolkit': 'Advanced'
    },
    'pdf_fill_form_fields': {
        'description': 'Fill form fields in PDF documents.',
        'link': '/tools/pdf_fill_form_fields',
        'toolkit': 'Advanced'
    },
    'create_api_tool': {
        'name': 'Create API Tool',
        'description': 'Create a new API tool.',
        'link': '/tools/create_api_tool',
        'toolkit': 'Advanced'
    },
}

## Available tools
AVAILABLE_TOOLS = {
    'image_summary': multi_modal_tool,
    "searx_search": searx_search_tool,
	# 'repl_tool': repl_tool,
    # 'csv_tool': csv_tool,
    # 'pdf_get_field_names': pdf_get_field_names,
    # 'pdf_fill_form_fields': pdf_fill_form_fields,
    # 'playwright_toolkit': playwright_toolkit(),
}

ENDPOINTS = [
    {
        "name": "get_users",
        "description": "To retrieve list of users.",
        'link': '/tools/get_users',
        'toolkit': 'API',
        "url": "https://jsonplaceholder.typicode.com/users",
        "method": "GET",
        "headers": {
            "Content-Type": {
                "value":"application/json; charset=UTF-8",
                "encrypted": False
            }
        },
        "args": None
    },
    {
        "name": "get_posts",
        "description": "To retrieve list of posts.",
        "link": '/tools/get_posts',
        'toolkit': 'API',
        "url": "https://jsonplaceholder.typicode.com/posts",
        "method": "GET",
        "headers": {
            "Content-Type": {
                "value":"application/json; charset=UTF-8",
                "encrypted": False
            }
        },
        "args": None
    },
    {
        "name": "create_post",
        "description": "To create a new post.",
        "link": '/tools/create_post',
        'toolkit': 'API',
        "url": "https://jsonplaceholder.typicode.com/posts",
        "method": "POST",
        "headers": {
            "Content-Type": {
                "value":"application/json; charset=UTF-8",
                "encrypted": False
            }
        },
        "args": {
            "title": {
                "type": "str",
                "description": "The title of the post",
                "required": True
            },
            "body": {
                "type": "str",
                "description": "The body content of the post",
                "required": True
            },
            "userId": {
                "type": "int",
                "description": "The ID of the user creating the post",
                "required": True
            }
        }
    },
    APITool.__config__['json_schema_extra']['examples']['update_reqbody']
]