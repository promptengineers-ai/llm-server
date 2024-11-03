import { Message } from "../types/chat";
import { API_URL } from "@/config/app";
import { EmbeddingModel, SearchProvider } from "@/types/llm";


export class Client {
    protected apiUrl: string;
    protected botId: string | undefined;
    protected theme: string | undefined;

    constructor(_apiUrl?: string) {
        this.apiUrl = API_URL;
    }
}

export class ChatClient extends Client {
    protected controller: AbortController | null = null;

    constructor(_apiUrl?: string, _botId?: string, _theme?: any) {
        super(_apiUrl);
    }

    public async createDocs(payload: { loaders: any[], task_id: string }) {
        try {
            const response = await fetch(`${this.apiUrl}/api/v1/documents`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    task_id: payload.task_id,
                    loaders: payload.loaders,
                    splitter: {
                        type: "recursive",
                        chunk_size: 2000,
                        chunk_overlap: 0,
                    },
                }),
            });

            const data = await response.json();
            return data; // This will return the response data from the server
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error);
        }
    }

    public async createDocuments(payload: { task_id: string, data: any[] }) {
        try {
            const response = await fetch(`${this.apiUrl}/api/v1/documents`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    task_id: payload.task_id,
                    loaders: [
                        {
                            type: "base64",
                            data: payload.data,
                        },
                    ],
                    splitter: {
                        type: "recursive",
                        chunk_size: 1000,
                        chunk_overlap: 100,
                    },
                }),
            });

            const data = await response.json();
            return data; // This will return the response data from the server
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error);
        }
    }

    public async upsert(payload: {
        task_id: string;
        documents: any[];
        index_name: string;
        provider: SearchProvider;
        embedding: EmbeddingModel;
        batch_size?: number;
        parallel?: boolean;
        workers?: number;
    }) {
        try {
            const response = await fetch(
                `${this.apiUrl}/api/v1/documents/upsert`,
                {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        task_id: payload.task_id,
                        provider: payload.provider,
                        index_name: payload.index_name,
                        embedding: payload.embedding,
                        documents: payload.documents,
                        batch_size: payload.batch_size || 50,
                        parallel: payload.parallel || false,
                        workers: payload.workers || 1,
                    }),
                }
            );

            const data = await response.json();
            return data; // This will return the response data from the server
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error);
        }
    }

    public async listModels(type?: "embedding" | "multimodal") {
        try {
            // Construct the URL with conditional query parameter
            let url = `${this.apiUrl}/models`;
            if (type !== undefined) {
                url += `?type=${encodeURIComponent(type)}`;
            }

            const response = await fetch(url, { method: "GET" });

            const data = await response.json();
            return data; // This will return the response data from the server
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error);
        }
    }

    public async list() {
        try {
            const response = await fetch(`${this.apiUrl}/api/v1/c`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();
            return data; // This will return the response data from the server
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error);
        }
    }

    public async create(payload: {
        system: string;
        messages: Message[];
        retrieval?: any;
        tools?: string[];
    }) {
        try {
            const response = await fetch(`${this.apiUrl}/api/v1/c`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            return data; // This will return the response data from the server
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error);
        }
    }

    public async find(history_id: string) {
        try {
            const res = await fetch(`${this.apiUrl}/api/v1/c/${history_id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error);
        }
    }

    public async update(
        history_id: string,
        payload: {
            system: string;
            messages: Message[];
            retrieval?: any;
            tools?: string[];
        }
    ) {
        try {
            const response = await fetch(
                `${this.apiUrl}/api/v1/c/${history_id}`,
                {
                    method: "PUT",
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();
            return data; // This will return the response data from the server
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error);
        }
    }

    public async delete(history_id: string) {
        try {
            await fetch(`${this.apiUrl}/api/v1/c/${history_id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error);
        }
    }

    public abortRequest() {
        if (this.controller) {
            this.controller.abort();
        }
    }
}