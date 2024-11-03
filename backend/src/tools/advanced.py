from langchain_experimental.utilities import PythonREPL
from langchain.tools import StructuredTool
from langchain_core.tools import ToolException

from src.models.tools.api import APITool
from src.services.db import get_db
from src.tools.api import create_schema

python_repl = PythonREPL()

def construct_user_tool(
	user_id: str,
	tool_name: str,
	tool_description: str, 
	args: dict = {
		'name': {
			'description': 'Name of the tool.', 
			'type': 'str', 
			'default': 'this_is_a_test_tool', 
			'required': True
		}, 
		'description': {
			'description': 'Description of the tool.', 
			'type': 'str', 
			'default': '', 
			'required': True
		}, 
		'link': {
			'description': 'Link to documentation for the tool.', 
			'type': 'str', 
			'default': '', 
			'required': False
		}, 
		'toolkit': {
			'description': 'Group of tools.', 
			'type': 'str', 
			'default': 'Advanced', 
			'required': True
		},
		'url': {
			'description': 'URL endpoint for the tool. Can interpolate args into url. Example: https://jsonplaceholder.typicode.com/posts/{post_id}?userId={user_id}', 
			'type': 'str', 
			'default': '', 
			'required': True
		},
		'method': {
			'description': 'HTTP method for the tool. GET, POST, PUT, DELETE.', 
			'type': 'str', 
			'default': 'GET', 
			'required': True
		},
		'headers': {
			'description': """Headers for the tool. Example: {"Content-Type": {"value": "application/json; charset=UTF-8", "encrypted": False}}""", 
			'type': 'dict', 
			'default': {}, 
			'required': False
		},
		'args': {
			'description': """Arguments for the tool. Can be used to interpolate into the URL. Example: {"project_id": {"description": "ID of the project", "type": "str", "default": '123456', "required": True}, "issue_id": {"description": "ID of the issue", "type": "str", "default": '654321', "required": True}}""", 
			'type': 'dict', 
			'default': {}, 
			'required': False
		}
	},
) -> StructuredTool:
	from src.repositories.tool import tool_repo
	if args:
		args = create_schema(tool_name+"_schema", args)

	# Define a wrapper function to be used as the callable
	async def endpoint_func(**kwargs):
		try:
			db_gen = get_db()
			db = await db_gen.__anext__()
			repo = tool_repo(user_id=user_id, db=db)
			created = await repo.create(APITool(**kwargs))
			return {"tool": created['value']}
		except Exception as e:
			raise ToolException(str(e))

	return StructuredTool.from_function(
		name=tool_name,
		coroutine=endpoint_func,  # Pass the wrapper function here
		description=tool_description,
		args_schema=args,
		handle_tool_error=True,
	)