import { SearchProvider, ModelType, SearchType, EmbeddingModel } from "./llm";

export type ChatPayload = {
    query: string;
    history_id: string;
    system: string;
    model: ModelType;
    temperature: number;
    tools: string[];
    retrieval: {
        provider: SearchProvider;
        embedding: EmbeddingModel;
        index_name: string;
        search_type: SearchType;
        search_kwargs: {
            k: number;
            fetch_k: number | null;
            score_threshold: number | null;
        };
    };
};
