# Desc: This file contains the list of tools that are available to the server.
from server.tools.retrieval import (pinecone_list_indexes, pinecone_index_info, 
									pinecone_similarity_search, pinecone_rag)
from promptengineers.tools import math_tool

AVAILABLE_TOOLS = {
	'math_tool': math_tool,
	### Retrieval
	'pinecone_list_indexes': pinecone_list_indexes,
	'pinecone_index_info': pinecone_index_info,
	'pinecone_similarity_search': pinecone_similarity_search,
	'pinecone_rag': pinecone_rag,
}
