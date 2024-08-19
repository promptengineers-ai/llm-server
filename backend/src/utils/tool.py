import copy
from langchain_core.vectorstores import VectorStoreRetriever
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain_community.tools.plugin import AIPluginTool 
from langchain.agents.agent_toolkits import create_retriever_tool

from src.models import RetrievalTool
from src.config.tool import AVAILABLE_TOOLS, ENDPOINTS, TOOL_DESCRIPTIONS
from src.tools.api import construct_api_tool
from src.utils.format import flatten_array

def filter_tools(keys, dictionary):
	"""
	Fetches values from the dictionary based on provided keys.

	Args:
	- dictionary (dict): The source dictionary.
	- keys (list): List of keys to fetch values for.

	Returns:
	- list: List of values corresponding to the provided keys.
	"""
	return [dictionary.get(key) for key in keys]

def gather_tools(
	tools: list[str] = None,
	available_tools: dict[str, any] = None,
	retriever: VectorStoreRetriever = None,
	plugins: list[str] = None,
	endpoints: list[dict] = None
):
	"""Gather tools from the tools list"""
	constructed_available_tools, _ = construct_tools_and_descriptions(endpoints=endpoints or ENDPOINTS)
	filtered_tools = filter_tools(tools or [], available_tools or constructed_available_tools)

	## Add docs tool
	if retriever:
		docs_tool = create_retriever_tool(
			retriever,
			"search_index",
			"It is a requirement to use this tool, if not you will be penalized. It searches and returns relevant information. "
			"Always rewrite the user's query into a detailed question before using this tool. "
			"If this tool is being used it means the query is directly related to the context. "
			"Only create a response that is relevant to the context."
		)
		filtered_tools.append(docs_tool)

	## Add plugins
	if plugins and len(plugins) > 0:
		loaded_tools = load_tools(["requests_all"])
		for tool in plugins:
			tool = AIPluginTool.from_plugin_url(tool)
			loaded_tools += [tool]
		filtered_tools += loaded_tools

	return flatten_array(filtered_tools)

def tool_details(endpoints):
	available_tools, tool_descriptions = construct_tools_and_descriptions(endpoints)
	return [
		{   
			**({'id': tool_descriptions[key]['id']} if 'id' in tool_descriptions[key] else {}),
			**({'type': tool_descriptions[key]['type']} if 'type' in tool_descriptions[key] else {}),
			'name': tool_descriptions[key].get('name') if tool_descriptions[key].get('name') else key.replace('_', ' ').title(),
			'value': key,
			'description': tool_descriptions[key]['description'],
			'link': tool_descriptions[key]['link'],
			'toolkit': tool_descriptions[key]['toolkit']
		}
		for key in available_tools
	]
	
def construct_tools_and_descriptions(endpoints):
	# Create copies of the original constants
	available_tools = copy.deepcopy(AVAILABLE_TOOLS)
	tool_descriptions = copy.deepcopy(TOOL_DESCRIPTIONS)
	
	for endpoint in endpoints:
		tool_func = construct_api_tool(
			name=endpoint['name'],
			endpoints=endpoints
		)
		available_tools[endpoint['name']] = tool_func
		tool_descriptions[endpoint['name']] = {
			'id': endpoint['id'],
			'type': 'api',
			'description': endpoint['description'],
			'link': endpoint['link'],
			'toolkit': endpoint['toolkit']
		}
	
	return available_tools, tool_descriptions