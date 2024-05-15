import { SearchProvider, ModelType, SearchType } from "./llm";

export type ChatPayload = {
    query: string;
    history_id: string;
    model: ModelType;
    temperature: number;
    tools: string[];
    retrieval: {
        provider: SearchProvider;
        index_name: string;
        search_type: SearchType;
        search_kwargs: {
            k: number;
            fetch_k: number | null;
            score_threshold: number | null;
        };
    };
};
