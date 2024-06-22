import { SearchProvider, ModelType, SearchType, EmbeddingModel } from "./llm";

export interface Tool {
    name: string;
    value: string;
    description: string;
    link: string;
    enabled: boolean;
    toolkit: string;
}

export type ChatPayload = {
    query: string;
    history_id: string;
    system: string;
    model: ModelType;
    temperature: number;
    tools: Tool[];
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

export type LLM = {
    model_name: string;
    multimodal: boolean;
    embedding: boolean;
};

export type Message = {
    role: string;
    content: string;
    actions?: any[];
    sources?: any[];
    images?: string[];
    model?: ModelType;
};

export type ChatContextType = {
    chatboxRef: React.MutableRefObject<HTMLInputElement | null>;
    chatInputRef: React.MutableRefObject<HTMLInputElement | null>;
    userInputRef: React.MutableRefObject<HTMLInputElement | null>;
    chats: any[];
    setChats: (chats: any[]) => void;
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    sendChatPayload: (event: any) => void;
    chatPayload: { query: string; history_id: string };
    setChatPayload: (payload: any) => void;
    chatboxRefIsEmpty: boolean;
    setChatboxRefIsEmpty: (isEmpty: boolean) => void;
    resetChat: (event: any) => void;
};