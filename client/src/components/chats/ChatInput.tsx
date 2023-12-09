/* eslint-disable react-hooks/exhaustive-deps */
import '../../pages/ChatPage/styles.css'
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useChatContext } from '../../contexts/ChatContext';
import { ChatClient } from '../../utils/api/chat';

const chatClient = new ChatClient();

export default function ChatInput(props: { type?: string }) {
	const { botAccessToken } = useAuthContext();
	const {
		inputRef,
		chatPayload,
		setChatPayload,
		updateHistories,
		messages,
		setMessages,
		chatboxRef,
		setChatboxRefIsEmpty
	} = useChatContext();
	const [loading, setLoading] = useState(false);
	const [sendButtonColor, setSendButtonColor] = useState('gray');
	const [aborting, setAborting] = useState(false);

	async function updateCallback(streamMessages: {role: string, content: string}[]): Promise<void> {
		setMessages(streamMessages);
		setLoading(false);
		if (!chatPayload._id) {
			const history = await chatClient.createChatHistory(botAccessToken, {
				temperature: (parseInt(sessionStorage.getItem('temperature') || '') || chatPayload.temperature),
				model: sessionStorage.getItem('model') || chatPayload.model,
				messages: streamMessages,
				tools: props.type === 'agent' ? chatPayload.tools : [],
				functions: 'function' ? chatPayload.functions : [],
				vectorstore: props.type === 'vectorstore' ? chatPayload.vectorstore : '',
			})
			setChatPayload({...chatPayload, query: '', _id: history._id });
		} else {
			await chatClient.updateChatHistory(botAccessToken, chatPayload._id, {
				temperature: (parseInt(sessionStorage.getItem('temperature') || '') || chatPayload.temperature),
				model: sessionStorage.getItem('model') || chatPayload.model,
				messages: streamMessages,
				tools: props.type === 'agent' ? chatPayload.tools : [],
				functions: 'function' ? chatPayload.functions : [],
				vectorstore: props.type === 'vectorstore' ? chatPayload.vectorstore : '',
			})
			setChatPayload({...chatPayload, query: '' });
		}
		updateHistories();
		inputRef.current?.focus();
	}

	const sendMessage = async (event: any) => {
		event.preventDefault();
		if (!chatPayload.query) {
			alert('Please enter a message first.');
			return;
		}
		if (props.type === 'agent' && chatPayload.tools.length === 0) {
			alert('Please select at least one tool.');
			return;
		};
		setLoading(true);
		setAborting(false);
		// Create a copy of the current messages
		const updatedMessages = [...messages];
		// Append the user's message to the conversation
		updatedMessages[0].content = sessionStorage.getItem('systemMessage') || chatPayload.systemMessage;
		updatedMessages.push({role: 'user', content: chatPayload.query});
		// Construct the payload
		const model = chatPayload.model;
		const temperature = parseFloat(sessionStorage.getItem('temperature') || '') || chatPayload.temperature;
		let payload: any = {};
		payload = {...chatPayload, model, temperature, messages: updatedMessages};
		setChatboxRefIsEmpty(false);
		if (props.type === 'vectorstore') {
			await chatClient.sendLangchainVectorstoreChatMessage(
				botAccessToken,
				{...payload, source: sessionStorage.getItem('vectorstore') },
				updateCallback
			)
		} else if (props.type === 'agent') {
			await chatClient.sendLangchainAgentChatMessage(
				botAccessToken,
				{...payload, tools: chatPayload.tools},
				updateCallback
			)
		} else {
			await chatClient.sendChatStreamMessage(
				botAccessToken,
				payload,
				true,
				updateCallback
			)
		}

		if (aborting) {
			chatClient.abortRequest();
		}

		inputRef.current?.focus();
	}

	const handleChatboxClick = (e: MouseEvent) => {
		console.log('Chatbox button clicked');
		if ((e.target as HTMLElement).closest('.copy-btn')) {
			console.log('Copy button clicked');
			// 2. Get the code content
			const preElement = (e.target as HTMLElement).closest('pre');
			const codeContent = preElement?.querySelector('code')?.innerText || '';
			console.log(codeContent)
			// 3. Use Clipboard API to copy
			navigator.clipboard.writeText(codeContent).then(() => {
				// Optional: Show a toast or feedback to user saying "Copied to clipboard!"
				alert('Copied to clipboard!');
				return;
			}).catch(err => {
				console.error('Failed to copy: ', err);
			});
		}

		if ((e.target as HTMLElement).closest('.delete-btn')) {
			const messageDiv = (e.target as HTMLElement).closest('.message') as HTMLElement;
			const allMessages = Array.from(chatboxRef.current.children);
			const messageIndex = allMessages.indexOf(messageDiv);

			// Create a copy of the current messages
			const updatedMessages = [...messages];
			let lastElement = updatedMessages[messageIndex + 1];
			setChatPayload({...chatPayload, query: lastElement.content});

			// Remove elements from the array
			allMessages.splice(messageIndex);
			updatedMessages.splice(messageIndex+1); // Includes a system message
			setMessages(updatedMessages);

			// Remove corresponding DOM elements
			while (chatboxRef.current.children.length > messageIndex) {
				chatboxRef.current.removeChild(chatboxRef.current.lastChild!);
			}
		}
	}

	const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
		const target = event.currentTarget;
		target.style.height = 'auto';
		target.style.height = `${target.scrollHeight}px`;
	};

	useEffect(() => {
		chatboxRef.current?.addEventListener('click', handleChatboxClick);

		// inputRef.current?.focus();

		// Cleanup event listener
		return () => {
			chatboxRef.current?.removeEventListener('click', handleChatboxClick);
		};
	}, [messages, inputRef]);

	useEffect(() => {
		if (!chatPayload?.query) {
			setSendButtonColor('gray');
		} else {
			setSendButtonColor('blue');
		}
	}, [chatPayload?.query, botAccessToken]);

	const handleKeyPress = (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage(event);
        }
    };

	return (
		<div className="input-area">
            {/* <div className="input-group"> */}
                <textarea
                    className="form-control"
                    rows={2}
                    onInput={handleInput}
                    disabled={loading}
                    placeholder="Ask a question..."
                    ref={inputRef}
                    onChange={(e: any) => setChatPayload({...chatPayload, query: e.target.value})}
                    value={chatPayload?.query || ''}
					onKeyPress={handleKeyPress}
                ></textarea>
                <button
                    className={`btn btn-${chatPayload.query ? 'primary' : 'light'}`}
                    aria-label={loading && !aborting ? "Abort" : "Send message"}
                    type="submit"
                    onClick={(e) => {
                        if (loading && !aborting) {
                            setAborting(true);
                            chatClient.abortRequest();
                            // removeLastItem();
                            setAborting(false);
                            setLoading(false);
                        } else {
                            sendMessage(e);
                        }
                    }}
                >
                    <i className="bi bi-send"></i>
                </button>
            {/* </div> */}
		</div>
	)
}