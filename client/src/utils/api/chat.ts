import axios from 'axios';
import { API_URL } from "../../config/index";
import { API } from './index';
import {
	constructAssistantHttpMessageDiv,
    constructUserMessageDiv,
    readStreamResponse,
  } from '../chat';


export class ChatClient extends API {
	private controller: AbortController | null = null;

	// Method to abort the ongoing request
	public abortRequest() {
		if (this.controller) {
		  this.controller.abort();
		}
	}

    public async history(token: string, payload: any) {
        const options = this.getHeaders(token, 'bot');
        let url = `${API_URL}/api/v1/chat/history`;
        if(payload.session) {
            url += "?"
            if (payload.session) {
                url += `session=${payload.session}`
            }
        }
        const res = await axios.get(
            url,
            options
        );
        return res;
    }

    public async presets(token: string) {
        const options = this.getHeaders(token, 'bot');
        let url = `${API_URL}/api/v1/prompts/system`;
        const res = await axios.get(
            url,
            options
        );
        return res;
    }

    public async createPreset(token: string, payload: {title: string, prompt: string}) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.post(
            `${API_URL}/api/v1/prompts/system`,
            payload,
            options
        );
        return res;
    }

    public async deletePreset(token: string, item: any) {
        const options = this.getHeaders(token, 'bot');
        let url = `${API_URL}/api/v1/prompts/system/${item._id}`;
        const res = await axios.delete(
            url,
            options
        );
        return res;
    }

    public async sendContextChatMessage(
        token: string,
        payload: {
            channel: string | undefined,
            question: string,
            system: string,
            model: string,
            temperature: number,
            sources: boolean,
            context: {
                faiss: {
                    bucket_name: string | undefined,
                    path: string
                }
            }
        }
    ) {
        const options = this.getHeaders(token, 'bot');
        let url = `${API_URL}/api/v1/chat/vectorstore`;
        if(payload.channel) {
            url += "?"
            if (payload.channel) {
                url += `channel=${payload.channel}`
            }
        }
        const res = await axios.post(
            url,
            payload,
            options
        );
        return res;
    }

    public async sendChatMessage(
        token: string,
        payload: {
            channel: string | undefined,
            question: string,
            system: string,
            model: string,
            temperature: number
        }
    ) {
        const options = this.getHeaders(token, 'bot');
        let url = `${API_URL}/api/v1/chat/message`;
        if(payload.channel) {
            url += "?"
            if (payload.channel) {
                url += `channel=${payload.channel}`
            }
        }
        const res = await axios.post(
            url,
            payload,
            options
        );
        return res;
    }

    public async sendChatStreamMessage(
        token: string,
        payload: {
            model: string,
            temperature: number,
            messages: {role: string, content: string}[],
        },
		stream?: boolean,
        cb?: (streamMessages: {role: string, content: string}[]) => void
    ) {
		// Abort any ongoing requests
		if (this.controller) {
			this.controller.abort();
		}

		this.controller = new AbortController();

        // Add the user's message to the messages array
        let userMessageDiv = constructUserMessageDiv(payload.messages);

        // Add the message div to the chatbox
        let chatbox = document.getElementById('chatbox') as HTMLDivElement;
        chatbox.appendChild(userMessageDiv);
		chatbox.scrollTop = chatbox.scrollHeight;

		let url = `${API_URL}/api/v1/chat`;
        fetch(url, {
			method: 'POST',
			...this.getHeaders(token, 'bot'),
			signal: this.controller.signal,
			body: JSON.stringify({
				stream: true,
				messages: payload.messages,
				model: payload.model,
				temperature: payload.temperature,
			}),
		})
.then(response => {
    console.log('Server Response:', response);

    // Ensure the response is valid before processing further
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (stream) {
        readStreamResponse(response, payload.messages, chatbox, cb || (() => {}));
    } else {
        return response.json();
    }
})
		.then(data => {
			// This will only be executed if `stream` is false
			if (data) {
				const assistantHttpMessageDiv = constructAssistantHttpMessageDiv(data.result)
				chatbox.appendChild(assistantHttpMessageDiv);
			}
		}).catch(error => {
			if (error.name === 'AbortError') {
				console.log('Request aborted by user');
				return;
			} else {
				console.error('Fetch error:', error);
			}
		});
    }

    /**----------------------------------------------------------
     * Send a message to the server and get a response
     * ----------------------------------------------------------
     * @returns
     */
    public async sendLangchainAgentChatMessage(
        token: string,
        payload: {
            model: string,
            temperature: number,
            messages: {role: string, content: string}[],
            tools: string[],
        },
        cb: (streamMessages: {role: string, content: string}[]) => void
    ) {
		// Abort any ongoing requests
		if (this.controller) {
			this.controller.abort();
		}

		this.controller = new AbortController();

        // Add the user's message to the messages array
        let userMessageDiv = constructUserMessageDiv(payload.messages);

        // Add the message div to the chatbox
        let chatbox = document.getElementById('chatbox') as HTMLDivElement;
        chatbox.appendChild(userMessageDiv);
		chatbox.scrollTop = chatbox.scrollHeight;

        fetch(`${API_URL}/api/v1/chat/agent`, {
            method: 'POST',
            ...this.getHeaders(token, 'bot'),
			signal: this.controller.signal,
            body: JSON.stringify({
                messages: payload.messages,
                model: payload.model,
                temperature: payload.temperature,
				stream: true,
                tools: payload.tools,
            }),
        }).then(response => {
            console.log('Server Response:', response);
            readStreamResponse(response, payload.messages, chatbox, cb);
        }).catch(error => {
			if (error.name === 'AbortError') {
				console.log('Request aborted by user');
				return;
			} else {
				console.error('Fetch error:', error);
			}
		});
    }

    /**----------------------------------------------------------
     * Send a message to the server and get a response
     * ----------------------------------------------------------
     * @returns
     */
    public async sendLangchainVectorstoreChatMessage(
        token: string,
        payload: {
            model: string,
            vectorstore: string,
            temperature: number,
            messages: {role: string, content: string}[],
            provider: string,
        },
        cb: (streamMessages: {role: string, content: string}[]) => void,
    ) {

        if (!payload.vectorstore) {
            alert('Please select a vectorstore.');
            return;
        }

		// Abort any ongoing requests
		if (this.controller) {
			this.controller.abort();
		}

		this.controller = new AbortController();

        // Add the user's message to the messages array
        let userMessageDiv = constructUserMessageDiv(payload.messages);

        // Add the message div to the chatbox
        let chatbox = document.getElementById('chatbox') as HTMLDivElement;
        chatbox.appendChild(userMessageDiv);
		chatbox.scrollTop = chatbox.scrollHeight;

        fetch(`${API_URL}/api/v1/chat/vectorstore`, {
            method: 'POST',
            ...this.getHeaders(token, 'bot'),
			signal: this.controller.signal,
            body: JSON.stringify({
				provider: payload.provider,
                messages: payload.messages,
                vectorstore: payload.vectorstore,
                model: payload.model,
				stream: true,
                temperature: payload.temperature,
            }),
        }).then(response => {
            console.log('Server Response:', response);
            readStreamResponse(response, payload.messages, chatbox, cb);
        }).catch(error => {
			if (error.name === 'AbortError') {
				console.log('Request aborted by user');
				return;
			} else {
				console.error('Fetch error:', error);
			}
		});
    }

    /**----------------------------------------------------------
     * Retrieve the vectorstores from the server
     * ----------------------------------------------------------
     * @returns
     */

	public async fetchHistoryList(token: string) {
		try {
			const response = await axios.get(`${API_URL}/api/v1/chat/history`, this.getHeaders(token, 'bot'));
			return response.data;
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
}

    /**----------------------------------------------------------
     * Create Chat History
     * ----------------------------------------------------------
     * @returns
     */
    public async createChatHistory(
        token: string,
        payload: {
            model: string,
            temperature: number,
            messages: {role: string, content: string}[],
            tools: string[],
            functions: string[],
            vectorstore: string,
        },
    ) {
        return fetch(`${API_URL}/api/v1/chat/history`, {
            method: 'POST',
            ...this.getHeaders(token, 'bot'),
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    }

    /**----------------------------------------------------------
     * Update Chat History
     * ----------------------------------------------------------
     * @returns
     */
    public async updateChatHistory(
        token: string,
        id: string,
        payload: {
            title?: string,
            model?: string,
            temperature?: number,
            messages?: {role: string, content: string}[],
            tools: string[],
            functions: string[],
            vectorstore: string,
        },
    ) {
        return fetch(`${API_URL}/api/v1/chat/history/${id}`, {
            method: 'PUT',
            ...this.getHeaders(token, 'bot'),
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    }

    /**----------------------------------------------------------
     * Update Chat History
     * ----------------------------------------------------------
     * @returns
     */
     public async deleteChatHistory(token: string, id: string) {
        return fetch(`${API_URL}/api/v1/chat/history/${id}`, {
            method: 'DELETE',
            ...this.getHeaders(token, 'bot'),
        })
    }
}