export enum ModelType {
    OPENAI_GPT_4_OMNI = "gpt-4-vision-preview",
    OPENAI_GPT_4_TURBO = "gpt-4-turbo-preview",
    OPENAI_GPT_4 = "gpt-4",
    OPENAI_GPT_35_TURBO = "gpt-3.5-turbo",
    OLLAMA_LLAMA_3_CHAT = "llama2",
    OLLAMA_MISTRAL_CHAT = "mistral",
    OLLAMA_CODELLAMA_CHAT = "codellama",
}

export enum EmbeddingModel {
    OPENAI_TEXT_EMBED_3_LARGE = "text-embedding-3-large",
    OPENAI_TEXT_EMBED_3_SMALL = "text-embedding-3-small",
    OLLAMA_NOMIC_EMBED_TEXT = "nomic-embed-text",
}

export enum SearchProvider {
    POSTGRES = "postgres",
    PINECONE = "pinecone",
    WEAVIATE = "weaviate",
}

export enum SearchType {
    SIMILARITY = "similarity",
    MMR = "mmr",
}

export const modelLabels: { [key in ModelType]: string } = {
    [ModelType.OPENAI_GPT_4_OMNI]: "GPT-4 Vision",
    [ModelType.OPENAI_GPT_4_TURBO]: "GPT-4 Turbo",
    [ModelType.OPENAI_GPT_4]: "GPT-4",
    [ModelType.OPENAI_GPT_35_TURBO]: "GPT-3.5 Turbo",
    [ModelType.OLLAMA_LLAMA_3_CHAT]: "Llama 2",
    [ModelType.OLLAMA_MISTRAL_CHAT]: "Mistral",
    [ModelType.OLLAMA_CODELLAMA_CHAT]: "Code Llama",
};

export const multiModalModels = {
    [ModelType.OPENAI_GPT_4_OMNI]: true,
};

export const acceptRagSystemMessage = `You are a helpful AI assistant that can help users understand their documents. You have access to a knowledge base of documents that you can use to answer questions. When answering questions, please:

1. Use the provided context to answer questions
2. If you don't know the answer, say so
3. If you need more context, ask for it
4. If you're not sure about something, say so
5. Be concise and clear in your answers
6. Use markdown formatting when appropriate
7. If you use a quote, cite the source`;
