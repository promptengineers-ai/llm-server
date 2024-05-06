import {
    constructUserMessageDiv,
    constructAssistantMessageDiv,
    readStreamResponse,
} from "./chat";
import { log } from "../utils/log";
import { Message } from "../types";
import { API_URL } from "@/config/app";

/**----------------------------------------------------------
 * Send a message to the server and get a response
 * ----------------------------------------------------------
 * @returns
 */
export class Client {
    protected apiUrl: string;
    protected botId: string | undefined;
    protected theme: string | undefined;

    constructor(_apiUrl?: string) {
        this.apiUrl = _apiUrl || API_URL;
    }
}

export class ChatClient extends Client {
    protected controller: AbortController | null = null;

    constructor(_apiUrl?: string, _botId?: string, _theme?: any) {
        super(_apiUrl);
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

    public async create(payload: { messages: Message[] }) {
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
            messages: Message[];
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

    // Method to abort the ongoing request
    public abortRequest() {
        if (this.controller) {
            this.controller.abort();
        }
    }

    public async sendChatStreamMessage(
        payload: { messages: Message[] },
        cb: (streamMessages: Message[]) => void,
        onError: () => void
    ) {
        // Abort any ongoing requests
        if (this.controller) {
            this.controller.abort();
        }

        this.controller = new AbortController();

        // Add the user's message to the messages array
        let userMessageDiv = constructUserMessageDiv(
            payload.messages,
            this.theme
        );

        // Add the message div to the chatbox
        let chatbox = document.getElementById("chatbox") as HTMLDivElement;
        chatbox.appendChild(userMessageDiv);
        chatbox.scrollTop = chatbox.scrollHeight;

        // Construct the assistant message div (with spinner) right after user message is added
        let { assistantMessageDiv, spinner } = constructAssistantMessageDiv(
            this.theme
        );

        // Make the spinner visible
        spinner.style.display = "flex";

        // Add the assistant message (with the spinner) to the chatbox
        chatbox.appendChild(assistantMessageDiv);
        chatbox.scrollTop = chatbox.scrollHeight;

        fetch(`${this.apiUrl}/api/v1/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: this.controller.signal,
            body: JSON.stringify({
                streaming: true,
                ...payload,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    // Handle HTTP errors
                    response.json().then((errorData) => {
                        // Assuming the server sends a JSON response with an error message
                        alert(errorData.detail);
                        spinner.remove();
                        onError();
                        return;
                    });
                } else {
                    // Handle successful response
                    log("utils.api.ChatClient.sendChatStreamMessage", response);
                    readStreamResponse(
                        response,
                        payload.messages,
                        chatbox,
                        assistantMessageDiv,
                        spinner,
                        cb
                    );
                }
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    log(
                        "utils.api.ChatClient.sendChatStreamMessage",
                        "Request aborted by user"
                    );
                    return;
                } else {
                    console.error("Fetch error:", error);
                }
            });
    }
}

export class HistoryClient extends Client {
    public async create(payload: { messages: Message[] }) {
        return payload;
    }

    public async update(payload: { messages: Message[] }) {
        return payload;
    }
}
