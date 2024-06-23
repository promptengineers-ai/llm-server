export enum ModelType {
    OPENAI_EMBED_ADA = "openai-text-embedding-ada",
    OPENAI_TEXT_EMBED_3_SMALL = "openai-text-embedding-3-small",
    OPENAI_TEXT_EMBED_3_LARGE = "openai-text-embedding-3-large",
    OPENAI_GPT_3_5_TURBO_16K = "openai-gpt-3.5-turbo-16k",
    // OPENAI_GPT_4_TURBO_PREVIEW = "openai-gpt-4-turbo-preview",
    // OPENAI_GPT_4_VISION_PREVIEW = "openai-gpt-4-vision-preview",
    OPENAI_GPT_4_OMNI = "openai-gpt-4o",
    OLLAMA_NOMIC_EMBED_TEXT = "ollama-nomic-embed-text",
    OLLAMA_MXBAI_EMBED_LARGE = "ollama-mxbai-embed-large",
    OLLAMA_PHI3 = "ollama-phi3",
    OLLAMA_PHI3_14B = "ollama-phi3-14b",
    OLLAMA_LLAVA = "ollama-llava",
    OLLAMA_BAKLLAVA = "ollama-bakllava",
    OLLAMA_MISTRAL = "ollama-mistral",
    // OLLAMA_LLAMA_2 = "ollama-llama2",
    OLLAMA_LLAMA_2_CHAT = "ollama_chat-llama2",
    // OLLAMA_LLAMA_3 = "ollama-llama3",
    OLLAMA_LLAMA_3_CHAT = "ollama_chat-llama3",
    GROQ_MIXTRAL = "groq-mixtral",
    GROQ_GEMMA_7B_IT = "groq-gemma-7b-it",
    GROQ_LLAMA_3_70B = "groq-llama3-70b",
    ANTHROPIC_HAIKU = "anthropic-claude-3-haiku",
    ANTHROPIC_OPUS = "anthropic-claude-3-opus",
    ANTHROPIC_SONNET = "anthropic-claude-3.5-sonnet",
}

export const modelLabels: { [key in ModelType]: string } = {
    [ModelType.OPENAI_EMBED_ADA]: "OpenAI - Embed Ada",
    [ModelType.OPENAI_TEXT_EMBED_3_SMALL]: "OpenAI - Text Embed 3 Small",
    [ModelType.OPENAI_TEXT_EMBED_3_LARGE]: "OpenAI - Text Embed 3 Large",
    [ModelType.OPENAI_GPT_3_5_TURBO_16K]: "OpenAI -GPT-3.5 Turbo",
    // [ModelType.OPENAI_GPT_4_TURBO_PREVIEW]: "GPT-4 Turbo",
    // [ModelType.OPENAI_GPT_4_VISION_PREVIEW]: "GPT-4 Vision",
    [ModelType.OPENAI_GPT_4_OMNI]: "OpenAI -GPT-4 Omni",
    [ModelType.OLLAMA_NOMIC_EMBED_TEXT]: "Ollama - Nomic Embed Text",
    [ModelType.OLLAMA_MXBAI_EMBED_LARGE]: "Ollama - MxBai Embed Large",
    [ModelType.OLLAMA_PHI3]: "Ollama - Phi3",
    [ModelType.OLLAMA_PHI3_14B]: "Ollama - Phi3 14B",
    [ModelType.OLLAMA_LLAVA]: "Ollama - LLaVA",
    [ModelType.OLLAMA_BAKLLAVA]: "Ollama - BakLLaVA",
    [ModelType.OLLAMA_MISTRAL]: "Ollama - Mistral",
    // [ModelType.OLLAMA_LLAMA_2]: "Ollama - LLaMA 2",
    [ModelType.OLLAMA_LLAMA_2_CHAT]: "Ollama - LLaMA 2 Chat",
    // [ModelType.OLLAMA_LLAMA_3]: "Ollama - LLaMA 3",
    [ModelType.OLLAMA_LLAMA_3_CHAT]: "Ollama - LLaMA 3 Chat",
    [ModelType.GROQ_MIXTRAL]: "Groq - Mixtral",
    [ModelType.GROQ_GEMMA_7B_IT]: "Groq - Gemma 7b IT",
    [ModelType.GROQ_LLAMA_3_70B]: "Groq - LLaMA 3",
    [ModelType.ANTHROPIC_HAIKU]: "Anthropic - Claude 3 Haiku",
    [ModelType.ANTHROPIC_OPUS]: "Anthropic - Claude 3 Opus",
    [ModelType.ANTHROPIC_SONNET]: "Anthropic - Claude 3.5 Sonnet",
};

export const acceptRagSystemMessage = new Set<string>([
    ModelType.GROQ_LLAMA_3_70B,
    ModelType.GROQ_GEMMA_7B_IT,
    ModelType.GROQ_MIXTRAL,
    ModelType.OLLAMA_LLAMA_3_CHAT,
    ModelType.OLLAMA_MISTRAL,
    ModelType.OLLAMA_LLAVA,
    ModelType.OLLAMA_BAKLLAVA,
    ModelType.OLLAMA_LLAMA_2_CHAT,
    ModelType.OPENAI_GPT_3_5_TURBO_16K,
    // ModelType.OPENAI_GPT_4_TURBO_PREVIEW,
    // ModelType.OPENAI_GPT_4_VISION_PREVIEW,
    ModelType.OPENAI_GPT_4_OMNI, 
]);

export const multiModalModels = {
    [ModelType.OLLAMA_LLAVA]: "Ollama - LLaVA",
    [ModelType.OLLAMA_BAKLLAVA]: "Ollama - BakLLaVA",
    // [ModelType.OPENAI_GPT_4_VISION_PREVIEW]: "GPT-4 Vision",
    [ModelType.OPENAI_GPT_4_OMNI]: "OpenAI - GPT-4 Omni",
    [ModelType.ANTHROPIC_OPUS]: "Anthropic - Claude 3 Opus",
    [ModelType.ANTHROPIC_SONNET]: "Anthropic - Claude 3.5 Sonnet",
};

export const onPremModels = {
    [ModelType.OLLAMA_LLAVA]: "Ollama - LLaVA",
    [ModelType.OLLAMA_BAKLLAVA]: "Ollama - BakLLaVA",
    [ModelType.OLLAMA_MISTRAL]: "Ollama - Mistral",
    [ModelType.OLLAMA_LLAMA_2_CHAT]: "Ollama - LLaMA 2 Chat",
    [ModelType.OLLAMA_LLAMA_3_CHAT]: "Ollama - LLaMA 3 Chat",
    [ModelType.OLLAMA_NOMIC_EMBED_TEXT]: "Ollama - Nomic Embed Text",
    [ModelType.OLLAMA_MXBAI_EMBED_LARGE]: "Ollama - MxBai Embed Large",
    [ModelType.OLLAMA_PHI3]: "Ollama - Phi3",
    [ModelType.OLLAMA_PHI3_14B]: "Ollama - Phi3 14B",
};

export const embeddingModels = {
    [ModelType.OPENAI_EMBED_ADA]: "OpenAI - Embed Ada",
    [ModelType.OPENAI_TEXT_EMBED_3_SMALL]: "OpenAI - Text Embed 3 Small",
    [ModelType.OPENAI_TEXT_EMBED_3_LARGE]: "OpenAI - Text Embed 3 Large",
    [ModelType.OLLAMA_NOMIC_EMBED_TEXT]: "Ollama - Nomic Embed Text",
    [ModelType.OLLAMA_MXBAI_EMBED_LARGE]: "Ollama - MxBai Embed Large"
}

export enum MemoryType {
    CONVERSATION_KG = 'conversation_kg',
    AGENT_TOKEN_BUFFER = 'agent_token_buffer'
}

export enum EmbeddingModel {
    OPENAI_EMBED_ADA = ModelType.OPENAI_EMBED_ADA,
    OPENAI_TEXT_EMBED_3_SMALL = ModelType.OPENAI_TEXT_EMBED_3_SMALL,
    OPENAI_TEXT_EMBED_3_LARGE = ModelType.OPENAI_TEXT_EMBED_3_LARGE,
    OLLAMA_NOMIC_EMBED_TEXT = ModelType.OLLAMA_NOMIC_EMBED_TEXT,
    OLLAMA_MXBAI_EMBED_LARGE = ModelType.OLLAMA_MXBAI_EMBED_LARGE,
}

export enum SearchType {
    MMR = "mmr",
    SIMILARITY = "similarity",
    SIMILARITY_SCORE_THRESHOLD = "similarity_score_threshold",
}

export enum SearchProvider {
    PINECONE = "pinecone",
    REDIS = "redis",
    MONGO = "mongo",
    FAISS = "faiss",
}
