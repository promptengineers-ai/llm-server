'use client';
import {
    useContext,
    createContext,
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { ChatClient } from "../utils/api";
import { ChatContextType, Message } from "../types";
import { IContextProvider } from "../interfaces/provider";
import { log } from "../utils/log";
import { ChatPayload } from "@/types/chat";
import { ModelType, SearchProvider, SearchType } from "@/types/llm";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { SSE } from "sse.js";
import { constructBubbleMessage } from "@/utils/chat";
import { userMessageTitleStyle } from "@/config/message";
import { API_URL } from "@/config/app";
import CopyCodeButton from "@/components/buttons/CopyCodeButton";

const defaultChatContextValue: ChatContextType = {
    loading: false,
    setLoading: () => {},
    chatboxRef: { current: null },
    chatInputRef: { current: null },
    userInputRef: { current: null },
    chats: [],
    setChats: () => {},
    messages: [],
    setMessages: () => {},
    sendChatPayload: () => {},
    chatPayload: { query: "", history_id: "" },
    setChatPayload: (event) => {},
    handleChatboxClick: () => {},
    chatboxRefIsEmpty: true,
    setChatboxRefIsEmpty: () => {},
    resetChat: (event) => {},
};

const ChatContext = createContext(defaultChatContextValue);
export default function ChatProvider({
    children,
}: IContextProvider) {
    const searchParams = useSearchParams();
    const chatClient = new ChatClient();
    const chatInputRef = useRef<HTMLInputElement | null>(null);
    const chatboxRef = useRef<HTMLInputElement | null>(null);
    const [chatboxRefIsEmpty, setChatboxRefIsEmpty] = useState(true);
    const userInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [chatPayload, setChatPayload] = useState<ChatPayload>({
        query: "",
        history_id: "",
        model: ModelType.OPENAI_GPT_3_5_TURBO_16K,
        temperature: 0.5,
        tools: [],
        retrieval: {
            provider: SearchProvider.REDIS,
            index_name: "",
            search_type: SearchType.MMR,
            search_kwargs: {
                k: 10,
                fetch_k: 20,
                score_threshold: 0.9,
            },
        },
    });
    const [chats, setChats] = useState<any[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const responseRef = useRef("");
    const [userInput, setUserInput] = useState("");
    const [response, setResponse] = useState("");

    const fetchChats = async () => {
        try {
            const data = await chatClient.list();
            setChats(data.chats);
        } catch (err) {
            alert(err);
            console.error(err);
        }
    };

    const findChat = async (chatId: string) => {
        try {
            const res = await chatClient.find(chatId);
            setMessages(res.chat.messages);
            renderConversation(res.chat.messages);
            let updatedUrl = `/chat/${chatId}`;
            if (searchParams.toString()) {
                updatedUrl += `?${searchParams.toString()}`;
            }
            shallowUrl(updatedUrl);
        } catch (err) {
            alert(err); // Display error message from the exception
            console.error(err);
        }
    };

    const deleteChat = async (chatId: string) => {
        // Ask for confirmation before deleting
        const confirmDelete = confirm(
            "Are you sure you want to delete this chat?"
        );
        if (!confirmDelete) {
            return; // If user clicks 'Cancel', exit the function
        }

        try {
            await chatClient.delete(chatId);
            setChats(chats.filter((chat) => chat.id !== chatId));
            if (chatId === chatPayload.history_id) {
                setMessages([])
            }
        } catch (err) {
            alert(err); // Display error message from the exception
            console.error(err);
        }
    };

    const handleImageClick = (src: string) => {
        setSelectedImage(src);
    };

    const prompt = () => {
        const defaultInput = `You are a chat bot. Please return all responses in Markdown.`;
        return { role: "system", content: defaultInput };
    };

    const combinePrompts = () => {
        const sysPrompt = prompt();

        const initialUserInput = { role: "user", content: userInput };
        setMessages((prevConversationContext) => [
            ...prevConversationContext,
            sysPrompt,
            initialUserInput,
        ]);

        return [sysPrompt, initialUserInput];
    };

    const sendChatPayload = async (event: any) => {
        event.preventDefault();

        const messageContent: Message = { role: "user", content: userInput };

        if (images.length > 0) {
            messageContent.images = images.map((image) => image.src);
        }

        setMessages([...messages, messageContent]);
        setImages([]);
    };

    const resetChat = (event: any) => {
        event.preventDefault();
        setUserInput("");
        shallowUrl("/chat");
        setMessages([]);
        setChatPayload({
            ...chatPayload,
            query: "",
            history_id: "",
        });
    };

    const adjustHeight = (height?: string) => {
        const textarea = chatInputRef.current as unknown as HTMLTextAreaElement; // Type assertion
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = height ? height : `${textarea.scrollHeight}px`;
        }
    };

    const renderConversation = (messages: Message[]) => {
        let variants: { [key: string]: string } = {
            user: "primary",
            assistant: "secondary",
        };
        const filteredConvo = messages.filter((item) => item.role !== "system");

        return filteredConvo.map((conversationItem, i) => {
            return (
                <div
                    style={{ fontSize: "14px" }}
                    key={
                        variants[
                            conversationItem.role as keyof typeof variants
                        ] + i
                    }
                >
                    <p style={userMessageTitleStyle}>
                        {constructBubbleMessage(conversationItem.role)}
                    </p>
                    {conversationItem.images && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "flex-start",
                                gap: "10px",
                            }}
                        >
                            {conversationItem.images.map((image, index) => (
                                <img
                                    onClick={() => setSelectedImage(image)}
                                    key={index}
                                    src={image}
                                    alt={image || "Conversation image"}
                                    className="my-2"
                                    style={{
                                        cursor: "pointer",
                                        maxWidth: "350px",
                                        maxHeight: "450px",
                                        borderRadius: "5px",
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => (
                                <h1
                                    className="text-2xl font-bold my-4"
                                    {...props}
                                />
                            ),
                            p: ({ node, ...props }) => (
                                <p
                                    className={`py-2 px-2 text-gray-700 `}
                                    {...props}
                                />
                            ),
                            code: (props) => {
                                const { children, className, node, ...rest } =
                                    props;
                                const match = /language-(\w+)/.exec(
                                    className || ""
                                );
                                return match ? (
                                    <div className="text-white dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium">
                                        <div className="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                            <span>
                                                {match[0].replace(
                                                    "language-",
                                                    ""
                                                )}
                                            </span>
                                            <div className="flex items-center">
                                                <span
                                                    className=""
                                                    data-state="closed"
                                                >
                                                    <CopyCodeButton />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto text-left">
                                            <code
                                                className="rounded px-1 py-0.5 font-bold"
                                                {...props}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <code
                                        className="rounded px-1 py-0.5 font-bold"
                                        {...props}
                                    />
                                );
                            },
                            ul: ({ node, ...props }) => (
                                <ul
                                    className="list-disc pl-5 my-2"
                                    {...props}
                                />
                            ),
                            li: ({ node, ...props }) => (
                                <li className="ml-2" {...props} />
                            ),
                            a: ({ node, ...props }) => (
                                <a
                                    target="_blank"
                                    className="text-blue-500 underline"
                                    {...props}
                                />
                            ),
                        }}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[
                            rehypeSanitize,
                            rehypeRaw,
                            rehypeHighlight,
                        ]}
                    >
                        {conversationItem.content}
                    </ReactMarkdown>
                </div>
            );
        });
    };

    const submitQuestionStream = async () => {
        setLoading(true);
        responseRef.current = "";
        setResponse("");
        setUserInput("");
        const config = {
            model: chatPayload.model,
            messages: !messages.length ? combinePrompts() : messages,
            tools: chatPayload.tools,
            retrieval: chatPayload.retrieval,
            temperature: chatPayload.temperature,
            streaming: true,
        };

        const source = new SSE(API_URL + "/api/v1/chat", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // set this yourself
            },
            payload: JSON.stringify(config),
        });
        source.addEventListener("message", (e: any) => {
            const jsonObjectsRegExp = /{[\s\S]+?}(?=data:|$)/g;
            const jsonObjectsMatches = e.data.match(jsonObjectsRegExp);

            if (jsonObjectsMatches) {
                // Parse the JSON objects and store them in an array
                const objectsArray = jsonObjectsMatches.map((json: any) =>
                    JSON.parse(json)
                );

                if (objectsArray) {
                    responseRef.current += objectsArray[0].message; // Accumulate response
                    setResponse(responseRef.current); // Set the full response
                    if (objectsArray[0].type === "end") {
                        // Check if it's the final message
                        setLoading(false);
                        updateMessages([...messages, { role: "assistant", content: responseRef.current }]);
                    }
                }
                
            } else {
                source.close();
            }
        });
        source.stream();
    };

    async function updateMessages(messages: Message[]) {
        if (!chatPayload.history_id) {
            const history = await chatClient.create({
                messages: messages,
            });
            log("contexts.ChatContext.updateCallback", history, "Created");
            setChatPayload({
                ...chatPayload,
                query: "",
                history_id: history.chat.id,
            });
            let updatedUrl = `/chat/${history.chat.id}`;
            if (searchParams.toString()) {
                updatedUrl += `?${searchParams.toString()}`;
            }
            shallowUrl(updatedUrl);
        } else {
            const history = await chatClient.update(chatPayload.history_id, {
                messages: messages,
            });
            log("contexts.ChatContext.updateCallback", history, "Updated");
        }
        chatInputRef.current?.focus();
        fetchChats();
    }

    function handleChatboxClick(e: MouseEvent) {
        if ((e.target as HTMLElement).closest(".copy-btn")) {
            // 2. Get the code content
            const preElement = (e.target as HTMLElement).closest("pre");
            const codeContent =
                preElement?.querySelector("code")?.innerText || "";
            log(
                "contexts.ChatContext.handleChatboxClick",
                codeContent,
                "Code Content"
            );
            // 3. Use Clipboard API to copy
            navigator.clipboard
                .writeText(codeContent)
                .then(() => {
                    // Optional: Show a toast or feedback to user saying "Copied to clipboard!"
                    alert("Copied to clipboard!");
                    return;
                })
                .catch((err) => {
                    console.error("Failed to copy: ", err);
                });
        }
    }

    const shallowUrl = (url: string) => {
        window.history.replaceState(
            {
                ...window.history.state,
                as: url,
                url: url,
            },
            "",
            url
        );
    }

    useEffect(() => {
        // 1. Add an event listener on the chatbox
        const chatbox = document.getElementById("chatbox");
        chatbox?.addEventListener("click", handleChatboxClick);

        userInputRef.current?.focus();

        // Cleanup event listener
        return () => {
            chatbox?.removeEventListener("click", handleChatboxClick);
        };
    }, [messages, userInputRef]);

    useEffect(() => {
        response.length &&
            setMessages((prevConversationContext) => {
                const lastMessage =
                    prevConversationContext[prevConversationContext.length - 1];

                if (lastMessage && lastMessage.role === "assistant") {
                    // Update the last message from the assistant with the new content
                    return prevConversationContext.map((item, index) =>
                        index === prevConversationContext.length - 1
                            ? { role: "assistant", content: response }
                            : item
                    );
                } else {
                    // If the last message is not from the server, add a new server message
                    return [
                        ...prevConversationContext,
                        { role: "assistant", content: response },
                    ];
                }
            });
    }, [response]);

    useEffect(() => {
        if (userInput.length) {
            submitQuestionStream();
        }
    }, [messages]);

    return (
        <ChatContext.Provider
            value={useMemo(() => {
                return {
                    loading,
                    chatboxRef,
                    chatInputRef,
                    userInputRef,
                    messages,
                    chats,
                    images,
                    chatPayload,
                    chatboxRefIsEmpty,
                    userInput,
                    selectedImage,
                    files,
                    setFiles,
                    resetChat,
                    setChats,
                    setMessages,
                    setImages,
                    setLoading,
                    setChatPayload,
                    sendChatPayload,
                    handleChatboxClick,
                    setChatboxRefIsEmpty,
                    deleteChat,
                    findChat,
                    shallowUrl,
                    renderConversation,
                    setUserInput,
                    setSelectedImage,
                    handleImageClick,
                    fetchChats,
                    adjustHeight,
                };
            }, [
                chats,
                userInput,
                loading,
                chatboxRef,
                chatInputRef,
                userInputRef,
                messages,
                images,
                chatPayload,
                chatboxRefIsEmpty,
                selectedImage,
                files,
                resetChat,
                sendChatPayload,
                deleteChat,
                findChat,
                shallowUrl,
                renderConversation,
                setUserInput,
                setSelectedImage,
                handleImageClick,
                fetchChats,
                adjustHeight,
                setFiles,
            ])}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext(): any {
    return useContext(ChatContext);
}
