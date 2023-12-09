import { useContext, createContext, useState, useRef, useEffect } from "react";
import { IContextProvider } from "../interfaces/Provider";
import { useAuthContext } from "./AuthContext";
import { ChatClient } from "../utils/api/chat";
import { Defaults, OpenAiChatModels } from "../config/openai";
import { useLoaderContext } from "./LoaderContext";
import { filterChatHistory } from "../utils/chat";
import { ON_PREM } from "../config";
import { removeObjectById } from "../utils/format";
// import { filterChatHistory } from "../utils/chat";

export const ChatContext = createContext({});

const chatClient = new ChatClient();

export default function ChatProvider({ children }: IContextProvider) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatboxRef = useRef<HTMLTextAreaElement>(null);
	const [chatboxRefIsEmpty, setChatboxRefIsEmpty] = useState(true);

    // Contexts
    const { botAccessToken } = useAuthContext();
    const { params, setParams, loaderForm, vectorstores, setLoadersPayload, loadersPayload } = useLoaderContext();

    // State
	const [header, setHeader] = useState('');
	const [isChecked, setIsChecked] = useState(false);
    const [histories, setHistories] = useState<any>([]);
    const [connected, setConnected] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
    const [doneTyping, setDoneTyping] = useState(0);
    const [type, setType] = useState(() => {
		const savedType = sessionStorage.getItem('chatType');
		return savedType ?? 'default'; // Replace 'defaultType' with your default
	});
    const [systemMessage, setSystemMessage] = useState(() => {
		const savedSystem = sessionStorage.getItem('systemMessage');
		return savedSystem ?? Defaults.SYSTEM_MESSAGE_CHATGPT; // Replace 'defaultType' with your default
	});
    const [messages, setMessages] = useState([
        {role: 'system', content: ''},
    ]);
    const [tools, setTools] = useState([]);
    const [chatPayload, setChatPayload] = useState(() => {
        const savedModel = sessionStorage.getItem('model');
		const savedTemp = parseFloat(sessionStorage.getItem('temperature') || '');
		const savedSystem = sessionStorage.getItem('systemMessage');
		const savedVectorstore = sessionStorage.getItem('vectorstore');
		const savedProvider = sessionStorage.getItem('provider');
        return {
            _id: '',
            systemMessage: savedSystem ?? Defaults.SYSTEM_MESSAGE_CHATGPT,
            query: '',
            provider: savedProvider ?? (ON_PREM ? 'redis' : 'pinecone'),
            temperature: savedTemp ?? 0.5,
            model: savedModel ?? (ON_PREM ? 'llama2' : OpenAiChatModels.GPT_3_5_TURBO_16K), // Use savedModel if available
            vectorstore: savedVectorstore ?? (vectorstores[0]?.value || ''),
            functions: [],
            tools: [],
        };
    });

    async function fetchHistory() {
        try {
            const res = await chatClient.history(
                botAccessToken,
                loaderForm
            );
            console.log(res.data)
            return res
        } catch (error) {
            // Handle error here
            console.error(error);
            alert((error as any).response.data.detail)
        }
    }

    function resetChat() {
        setIsConfirmed(true);
		setChatboxRefIsEmpty(true);
        while (chatboxRef.current?.firstChild) {
            chatboxRef.current.removeChild(chatboxRef.current.firstChild);
        }
        setMessages([
            {role: 'system', content: ''},
        ]);
        setChatPayload({
            ...chatPayload,
            _id: '',
            // vectorstore: '',
            functions: [],
        });
        setTools([]);
        setTimeout((function() {
            console.log("This will be logged after 2 seconds");
            setIsConfirmed(false);
        }), 2000);
    }

    async function updateHistories() {
        const res = await chatClient.fetchHistoryList(botAccessToken);
        const histories = filterChatHistory(res.chats)
        setHistories(histories);
    }

    async function handleRemove(id: string) {
		const chatClient = new ChatClient();
		const res = await chatClient.deleteChatHistory(botAccessToken, id);
		if (res.status === 204) {
			setHistories(removeObjectById(histories, id));
			while (chatboxRef.current?.firstChild) {
				if(chatboxRef.current?.contains(chatboxRef.current.firstChild)) {
					chatboxRef.current.removeChild(chatboxRef.current.firstChild);
				}
			}
			setChatPayload({ ...chatPayload, _id: '' });
			setMessages([
				{role: 'system', content: ''},
			])
		};
	}

	useEffect(() => {
		if (messages.length > 1) {
			setChatboxRefIsEmpty(false);
		} else {
			setChatboxRefIsEmpty(true);
		}
	}, [messages]);

	useEffect(() => {
		// Save type to sessionStorage whenever it changes
		sessionStorage.setItem('chatType', type);
	}, [type]);

	useEffect(() => {
		// Save type to sessionStorage whenever it changes
		sessionStorage.setItem('systemMessage', chatPayload.systemMessage);
	}, [chatPayload.systemMessage]);

	useEffect(() => {
		// Save type to sessionStorage whenever it changes
		sessionStorage.setItem('model', chatPayload.model);
	}, [chatPayload.model]);

	useEffect(() => {
		// Save type to sessionStorage whenever it changes
		sessionStorage.setItem('temperature', (chatPayload.temperature as any));
	}, [chatPayload.temperature]);

	useEffect(() => {
		// Save type to sessionStorage whenever it changes
		sessionStorage.setItem('vectorstore', (chatPayload.vectorstore as any));
	}, [chatPayload.vectorstore]);

	useEffect(() => {
		// Save type to sessionStorage whenever it changes
		sessionStorage.setItem('provider', (chatPayload.provider as any));
        setLoadersPayload({ ...loadersPayload, provider: chatPayload.provider });
	}, [chatPayload.provider]);

    return (
        <ChatContext.Provider
            value={{
                updateHistories,
                params,
                setParams,
                fetchHistory,
                header,
                setHeader,
                messages,
                setMessages,
                connected,
                setConnected,
                isChecked,
                setIsChecked,
                inputRef,
                type,
                setType,
                doneTyping,
                setDoneTyping,
                chatPayload,
                setChatPayload,
                histories,
                setHistories,
                systemMessage,
                setSystemMessage,
                resetChat,
                isConfirmed,
                setIsConfirmed,
                tools,
                setTools,
                chatboxRef,
				chatboxRefIsEmpty,
				setChatboxRefIsEmpty,
                handleRemove
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext(): any {
  return useContext(ChatContext);
}