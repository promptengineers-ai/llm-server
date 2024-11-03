import { EmbeddingModel, ModelType, SearchProvider, SearchType } from "./llm";

export type LLM = {
    model_name: string;
    embedding?: boolean;
};

export interface Message {
    role: string;
    content: string;
    sources?: any[];
    actions?: any[];
    images?: string[];
    files?: any[];
}

export interface ChatPayload {
    query: string;
    history_id: string;
    system: string;
    model: ModelType;
    temperature: number;
    tools: any[];
    retrieval: {
        provider: SearchProvider;
        embedding: EmbeddingModel;
        index_name: string;
        indexes: string[];
        search_type: SearchType;
        search_kwargs: {
            k: number;
            fetch_k: number | null;
            score_threshold: number | null;
        };
        batch_size: number;
        parallel: boolean;
        workers: number;
    };
}