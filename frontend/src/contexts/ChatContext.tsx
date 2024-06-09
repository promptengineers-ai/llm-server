"use client";
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
import {
    EmbeddingModel,
    ModelType,
    SearchProvider,
    SearchType,
    acceptRagSystemMessage,
} from "@/types/llm";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { SSE } from "sse.js";
import { constructBubbleMessage } from "@/utils/chat";
import { userMessageTitleStyle } from "@/config/message";
import { API_URL, ON_PREM } from "@/config/app";
import CopyCodeButton from "@/components/buttons/CopyCodeButton";
import CopyIcon from "@/components/icons/CopyIcon";
import RegenerateIcon from "@/components/icons/RegenerateIcon";
import ThumbDownIcon from "@/components/icons/ThumbDownIcon";
import { useAppContext } from "./AppContext";
import DocumentIcon from "@/components/icons/DocumentIcon";
import { Default } from "@/config/default";
import { formatDate } from "@/utils/datetime";
import DocumentSection from "@/components/sections/DocumentSection";
import CollapseIcon from "@/components/icons/CollapseIcon";
import ExpandIcon from "@/components/icons/ExpandIcon";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import equal from "fast-deep-equal/react";

const defaultChatContextValue: ChatContextType = {
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
    chatboxRefIsEmpty: true,
    setChatboxRefIsEmpty: () => {},
    resetChat: (event) => {},
};

const ChatContext = createContext(defaultChatContextValue);
export default function ChatProvider({ children }: IContextProvider) {
    const { setLoading, loading, isMobile } = useAppContext();
    const searchParams = useSearchParams();
    const chatClient = new ChatClient();
    const chatInputRef = useRef<HTMLInputElement | null>(null);
    const chatboxRef = useRef<HTMLInputElement | null>(null);
    const [chatboxRefIsEmpty, setChatboxRefIsEmpty] = useState(true);
    const userInputRef = useRef<HTMLInputElement | null>(null);
    const [chatPayload, setChatPayload] = useState<ChatPayload>({
        query: "",
        history_id: "",
        system: Default.SYSTEM_MESSAGE,
        model: (
            ON_PREM 
            ? ModelType.OLLAMA_LLAMA_3_CHAT 
            : ModelType.OPENAI_GPT_4_OMNI
        ),
        temperature: 0.5,
        tools: [],
        retrieval: {
            provider: SearchProvider.REDIS,
            embedding: (
                ON_PREM 
                ? EmbeddingModel.OLLAMA_NOMIC_EMBED_TEXT 
                : EmbeddingModel.OPENAI_TEXT_EMBED_3_SMALL
            ),
            index_name: "",
            search_type: SearchType.SIMILARITY,
            search_kwargs: {
                k: 10,
                fetch_k: null,
                score_threshold: null,
            },
        },
    });
    const [initChatPayload, setInitChatPayload] = useState({
        system: chatPayload.system,
        retrieval: chatPayload.retrieval,
        tools: chatPayload.tools,
    });
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [chats, setChats] = useState<any[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [expand, setExpand] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
    const [csvContent, setCsvContent] = useState<string[][] | null>(null);

    const responseRef = useRef("");
    const [userInput, setUserInput] = useState("");
    const [response, setResponse] = useState("");
    const [done, setDone] = useState(true);

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
            setChatPayload((prev: ChatPayload) => ({
                ...prev,
                system: res.chat.system,
                history_id: chatId,
                retrieval: res.chat.retrieval,
                tools: res.chat.tools,
            }));
            renderConversation(res.chat.messages);
            setExpand(false);
            setSelectedDocument(null);
            setCsvContent(null);
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
                setMessages([]);
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
        return {
            role: "system",
            content:
                chatPayload.system + `\n\nCURRENT_DATETIME: ${formatDate()}`,
        };
    };

    const combinePrompts = () => {
        const sysPrompt = prompt();

        const initialUserInput = { role: "user", content: userInput };
        setMessages((prevConversationContext) => [
            ...prevConversationContext,
            sysPrompt,
            initialUserInput,
        ]);

        return [sysPrompt, ...messages];
    };

    const sendChatPayload = async (event: any) => {
        event.preventDefault();

        const messageContent: Message = { role: "user", content: userInput };

        if (images.length > 0) {
            messageContent.images = images.map((image) => image.src);
        }

        if (files.length > 0) {
            messageContent.sources = files.map((file) => file);
        }

        setMessages([...messages, messageContent]);
        setImages([]);
    };

    const messagesContainsSources = () => {
        return messages.some((message) => message.sources);
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
            retrieval: {
                ...chatPayload.retrieval,
                index_name: "",
            },
        });
        setDone(true);
    };

    const adjustHeight = (height?: string) => {
        const textarea = chatInputRef.current as unknown as HTMLTextAreaElement; // Type assertion
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = height
                ? height
                : `${textarea.scrollHeight}px`;
        }
    };

    const handleRegenerateClick = (index: number) => {
        if (index === 0) {
            alert("Cannot regenerate from the first message.");
            return;
        }

        // Update chatPayload with the content of the message just before the clicked one
        const messageAtIndex = messages[index - 1];
        const newMessages = messages.slice(0, index - 1);
        setMessages(newMessages);

        setTimeout(() => {
            setMessages([...newMessages, messageAtIndex]);
            setUserInput(messageAtIndex.content);
            // submitQuestionStream();
        }, 500);
    };

    const parseCSV = (text: string) => {
        const rows = text.split("\n").map((row) => row.split(","));
        return rows;
    };

    const handleDocumentClick = async (messageIndex: number, source: any) => {
        if (selectedDocument || csvContent) {
            setSelectedDocument(null);
            setCsvContent(null);
            return;
        } else {
            if (source.type === "text/plain") {
                try {
                    const response = await fetch(source.src);
                    const text = await response.text();
                    const blob = new Blob([text], { type: "text/plain" });
                    const blobUrl = URL.createObjectURL(blob);
                    setSelectedDocument(blobUrl);
                    setCsvContent(null);
                } catch (error) {
                    console.error("Failed to fetch text content:", error);
                }
            } else if (source.type === "text/csv") {
                try {
                    const response = await fetch(source.src);
                    const text = await response.text();
                    const parsedCSV = parseCSV(text);
                    setCsvContent(parsedCSV);
                    setSelectedDocument(null);
                } catch (error) {
                    console.error("Failed to fetch CSV content:", error);
                }
            } else {
                setSelectedDocument({ ...source, id: messageIndex });
                setCsvContent(null);
            }
        }
    };

    const renderConversation = (messages: Message[]) => {
        let variants: { [key: string]: string } = {
            user: "primary",
            assistant: "secondary",
        };
        const filteredConvo = messages.filter((item) => item.role !== "system");

        return filteredConvo.map((conversationItem, i) => {
            const isLastMessage = i === filteredConvo.length - 1;
            const images = conversationItem.images || [];
            const sources = conversationItem.sources || [];
            const noContent = !selectedDocument && !csvContent;
            return (
                <div
                    className="pl-2 text-sm mb-3"
                    key={
                        variants[
                            conversationItem.role as keyof typeof variants
                        ] + i
                    }
                >
                    <h2 style={userMessageTitleStyle}>
                        {constructBubbleMessage(conversationItem.role)}
                    </h2>
                    {conversationItem.role === "assistant" &&
                    loading &&
                    isLastMessage ? (
                        <div className="flex items-center">
                            <img
                                className="w-5 h-5 animate-spin mt-2 ml-1"
                                src="https://www.svgrepo.com/show/491270/loading-spinner.svg"
                                alt="Loading icon"
                            />
                            <span className="ml-2">Processing...</span>
                        </div>
                    ) : null}
                    {images.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "flex-start",
                                gap: "10px",
                            }}
                        >
                            {images.map((image, index) => (
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
                    {sources.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "flex-start",
                                gap: "10px",
                            }}
                            className="my-2"
                        >
                            {sources.map((source) => (
                                <div
                                    key={source.id}
                                    className="relative overflow-hidden rounded-xl border border-token-border-dark bg-white"
                                >
                                    <div className="p-2 w-52">
                                        <div className="flex flex-row items-center gap-2">
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                                                <DocumentIcon />
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="truncate font-medium">
                                                    {source.name}
                                                </div>
                                                <div className="truncate text-token-text-tertiary">
                                                    {source.type
                                                        .split("/")[1]
                                                        .toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1 right-2 flex gap-1">
                                        {!isMobile() && !noContent && (
                                            expand ? (
                                                <div
                                                    onClick={() =>
                                                        setExpand(!expand)
                                                    }
                                                >
                                                    <CollapseIcon size="18" />
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() =>
                                                        setExpand(!expand)
                                                    }
                                                >
                                                    <ExpandIcon size="18" />
                                                </div>
                                            )
                                        )}
                                        {noContent ? (
                                            <FaRegEye
                                                size="18"
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleDocumentClick(
                                                        i,
                                                        source
                                                    )
                                                }
                                            />
                                        ) : (
                                            <FaRegEyeSlash
                                                size="18"
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    handleDocumentClick(
                                                        i,
                                                        source
                                                    );
                                                    setExpand(false);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!expand &&
                        selectedDocument &&
                        selectedDocument.id === i && (
                            <div className="h-72">
                                <DocumentSection
                                    expand={true}
                                    document={selectedDocument.src}
                                />
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
                            h3: ({ node, ...props }) => (
                                <h3
                                    className="text-base font-bold my-2"
                                    {...props}
                                />
                            ),
                            p: ({ node, ...props }) => (
                                <p
                                    className={`py-1 text-gray-700 `}
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
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto">
                                    <table
                                        className="min-w-full bg-white border border-gray-300"
                                        {...props}
                                    />
                                </div>
                            ),
                            thead: ({ node, ...props }) => (
                                <thead className="bg-gray-200" {...props} />
                            ),
                            tbody: ({ node, ...props }) => (
                                <tbody className="bg-white" {...props} />
                            ),
                            tr: ({ node, ...props }) => (
                                <tr
                                    className="whitespace-nowrap border-b border-gray-200"
                                    {...props}
                                />
                            ),
                            th: ({ node, ...props }) => (
                                <th
                                    className="px-6 py-2 text-xs text-gray-500 border-r border-gray-200"
                                    {...props}
                                />
                            ),
                            td: ({ node, ...props }) => (
                                <td
                                    className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200"
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

                    {conversationItem.role === "assistant" && !loading && (
                        <div className="cursor-pointer mt-2 flex items-center gap-3">
                            <div
                                className="flex items-center justify-center"
                                onClick={() => {
                                    const textToCopy =
                                        conversationItem.content ||
                                        "No content to copy";
                                    navigator.clipboard
                                        .writeText(textToCopy)
                                        .then(() => {
                                            alert("Copied to clipboard!");
                                        })
                                        .catch((err) => {
                                            console.error(
                                                "Failed to copy: ",
                                                err
                                            );
                                        });
                                }}
                            >
                                <CopyIcon />
                            </div>
                            <div
                                className="flex items-center justify-center"
                                onClick={() => handleRegenerateClick(i)}
                            >
                                <RegenerateIcon />
                            </div>
                            <div
                                className="flex items-center justify-center"
                                onClick={() => alert("Will downvote")}
                            >
                                <ThumbDownIcon />
                            </div>
                            {conversationItem.model && (
                                <div className="flex items-center justify-center bg-black text-white px-1 rounded">
                                    <small>{conversationItem.model}</small>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        });
    };

    const submitCleanUp = () => {
        setChatPayload({ ...chatPayload, query: "" });
        setUserInput("");
        chatInputRef.current?.focus();
    };

    const submitQuestionStream = async () => {
        setDone(false);
        setLoading(true);
        responseRef.current = "";
        setResponse("");
        submitCleanUp();

        const config = {
            model: chatPayload.model,
            messages:
                chatPayload.retrieval.index_name &&
                !acceptRagSystemMessage.has(chatPayload.model)
                    ? messages
                    : combinePrompts(),
            // messages: combinePrompts(),
            tools: chatPayload.tools,
            retrieval: chatPayload.retrieval,
            temperature: chatPayload.temperature,
            streaming: true,
        };

        const tempAssistantMessage = {
            role: "assistant",
            content: "",
            model: chatPayload.model,
        };
        const updatedMessages = [...messages, tempAssistantMessage];
        setMessages(updatedMessages);
        const tempIndex = updatedMessages.length - 1;

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
                const objectsArray = jsonObjectsMatches.map((json: any) =>
                    JSON.parse(json)
                );

                if (objectsArray) {
                    if (
                        objectsArray[0].type === "stream" ||
                        objectsArray[0].type === "end"
                    ) {
                        responseRef.current += objectsArray[0].message;
                        setLoading(false);
                        setResponse(responseRef.current);
                        if (objectsArray[0].type === "end") {
                            // Replace the temporary message with the actual response
                            const finalMessages = [...updatedMessages];
                            finalMessages[tempIndex] = {
                                role: "assistant",
                                content: responseRef.current,
                                model: chatPayload.model,
                            };
                            setMessages(finalMessages);

                            updateMessages(
                                chatPayload.system,
                                finalMessages,
                                chatPayload.retrieval,
                                chatPayload.tools
                            );
                            setDone(true);
                        }
                    }

                    if (objectsArray[0].type === "doc") {
                        console.log(objectsArray[0].message);
                    }
                }
            } else {
                source.close();
                setLoading(false);
                setDone(true);
            }
        });

        source.stream();
    };

    async function updateMessages(
        system: string,
        messages: Message[],
        retrieval?: any,
        tools?: string[]
    ) {
        if (!chatPayload.history_id) {
            const history = await chatClient.create({
                system,
                messages,
                retrieval,
                tools,
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
                system,
                messages,
                retrieval,
                tools,
            });
            log("contexts.ChatContext.updateCallback", history, "Updated");
        }
        chatInputRef.current?.focus();
        fetchChats();
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
    };

    useEffect(() => {
        response.length &&
            setMessages((prevConversationContext) => {
                const lastMessage =
                    prevConversationContext[prevConversationContext.length - 1];

                if (lastMessage && lastMessage.role === "assistant") {
                    // Update the last message from the assistant with the new content
                    return prevConversationContext.map((item, index) =>
                        index === prevConversationContext.length - 1
                            ? {
                                  role: "assistant",
                                  content: response,
                                  model: chatPayload.model,
                              }
                            : item
                    );
                } else {
                    // If the last message is not from the server, add a new server message
                    return [
                        ...prevConversationContext,
                        {
                            role: "assistant",
                            content: response,
                            model: chatPayload.model,
                        },
                    ];
                }
            });
    }, [response]);

    useEffect(() => {
        if (userInput.length) {
            submitQuestionStream();
        }
    }, [messages]);

    useEffect(() => {
        if (!equal(initChatPayload, {system: chatPayload.system, retrieval: chatPayload.retrieval, tools: chatPayload.tools})) {
            setIsSaveEnabled(true);
        } else {
            setIsSaveEnabled(false);
        }
    }, [initChatPayload, chatPayload]);

    return (
        <ChatContext.Provider
            value={useMemo(() => {
                return {
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
                    done,
                    selectedDocument,
                    csvContent,
                    expand,
                    initChatPayload,
                    isSaveEnabled,
                    setCsvContent,
                    setFiles,
                    resetChat,
                    setChats,
                    setMessages,
                    setImages,
                    setChatPayload,
                    sendChatPayload,
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
                    setDone,
                    setSelectedDocument,
                    messagesContainsSources,
                    setExpand,
                    setInitChatPayload,
                    setIsSaveEnabled,
                };
            }, [
                chats,
                done,
                expand,
                userInput,
                chatboxRef,
                chatInputRef,
                userInputRef,
                messages,
                images,
                chatPayload,
                chatboxRefIsEmpty,
                selectedImage,
                files,
                selectedDocument,
                csvContent,
                initChatPayload,
                isSaveEnabled,
                setCsvContent,
                resetChat,
                setDone,
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
                setSelectedDocument,
                messagesContainsSources,
                setExpand,
                setInitChatPayload,
                setIsSaveEnabled,
            ])}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext(): any {
    return useContext(ChatContext);
}
