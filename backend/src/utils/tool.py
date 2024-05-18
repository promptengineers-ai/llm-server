from langchain.agents import load_tools
from langchain_community.tools.plugin import AIPluginTool 
from langchain.agents.agent_toolkits import create_retriever_tool

from src.models import RetrievalTool
from src.tools import AVAILABLE_TOOLS
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
    retrieval: RetrievalTool = None,
    plugins: list[str] = None,
):
    """Gather tools from the tools list"""
    filtered_tools = filter_tools(tools or [], available_tools or AVAILABLE_TOOLS)

    ## Add docs tool
    if retrieval.get('vectorstore', None):
        docs_tool = create_retriever_tool(
            retrieval.get('vectorstore').as_retriever(search_type=retrieval.get('search_type', None), search_kwargs=retrieval.get('search_kwargs', None)),
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