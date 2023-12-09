export const BASIC_TOOLS = [
	{
		value: 'math_tool',
		label: 'Calculator',
		description: 'Perform basic math operations',
		alwaysEnabled: true,
	},
]

export const OPENAI_TOOLS = [
	{
		value: 'generate_dalle_images',
		label: 'Generate DALL-E Images',
		description: 'Generate images using OpenAI\'s DALL-E model',
	},
]

export const PINECONE_TOOLS = [
	{
		value: 'pinecone_list_indexes',
		label: 'List Indexes',
		description: 'List all Pinecone indexes',

	},
	{
		value: 'pinecone_similarity_search',
		label: 'Similarity Search',
		description: 'Perform a similarity search on a Pinecone index',
	},
	{
		value: 'pinecone_index_info',
		label: 'Get Index Info',
		description: 'Get information about a Pinecone index',
	},
	{
		value: 'pinecone_rag',
		label: 'Retrieval Augmented Generation (RAG)',
		description: 'Generate text using Pinecone\'s retrieval augmented generation model',
	},
]