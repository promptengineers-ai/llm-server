"use client";
import {
    useContext,
    createContext,
    useMemo,
} from "react";
import { ChatClient } from "../utils/api";
import { Message } from "../types/chat";
import { IContextProvider } from "../interfaces/provider";
import { ChatPayload } from "@/types/chat";
import { acceptRagSystemMessage } from "@/types/llm";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { SSE } from "sse.js";
import {
    combinePrompts,
    constructBubbleMessage,
    shallowUrl,
} from "@/utils/chat";
import { userMessageTitleStyle } from "@/config/message";
import { API_URL } from "@/config/app";
import CopyCodeButton from "@/components/buttons/CopyCodeButton";
import CopyIcon from "@/components/icons/CopyIcon";
import RegenerateIcon from "@/components/icons/RegenerateIcon";
import ThumbDownIcon from "@/components/icons/ThumbDownIcon";
import { useAppContext } from "./AppContext";
import DocumentIcon from "@/components/icons/DocumentIcon";
import DocumentSection from "@/components/sections/DocumentSection";
import CollapseIcon from "@/components/icons/CollapseIcon";
import ExpandIcon from "@/components/icons/ExpandIcon";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import equal from "fast-deep-equal/react";
import { useChatState } from "@/hooks/state/useChatState";
import useChatEffects from "@/hooks/effect/useChatEffects";

const ChatContext = createContext({});
export default function ChatProvider({ children }: IContextProvider) {
    const { setLoading, loading, isMobile } = useAppContext();
    const {
        chatboxRef,
        chatInputRef,
        userInputRef,
        responseRef,
        done,
        setDone,
        chatPayload,
        setChatPayload,
        initChatPayload,
        setInitChatPayload,
        isSaveEnabled,
        setIsSaveEnabled,
        response,
        setResponse,
        models,
        userInput,
        setUserInput,
        messages,
        setMessages,
        images,
        setImages,
        files,
        setFiles,
        chats,
        setChats,
        expand,
        setExpand,
        selectedImage,
        setSelectedImage,
        selectedDocument,
        setSelectedDocument,
        csvContent,
        setCsvContent,
        fetchChats,
        deleteChat,
        handleImageClick,
        sendChatPayload,
        handleRegenerateClick,
        fetchModels,
        resetChat,
        handleDocumentClick,
        submitCleanUp,
        updateMessages,
        adjustHeight,
    } = useChatState();
    const searchParams = useSearchParams();
    const chatClient = new ChatClient();

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
                                        {!isMobile() &&
                                            !noContent &&
                                            (expand ? (
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
                                            ))}
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
                    {conversationItem.role === "assistant" ? (
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
                                    const {
                                        children,
                                        className,
                                        node,
                                        ...rest
                                    } = props;
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
                    ) : (
                        <p className="py-1 text-gray-700 whitespace-pre-wrap">
                            {conversationItem.content}
                        </p>
                    )}

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

    const submitQuestionStream = async () => {
        try {
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
                        : combinePrompts(chatPayload, messages, userInput),
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

            source.addEventListener("error", (e: any) => {
                console.error("Error received from server:", e);
                alert(JSON.parse(e.data).detail);
                setLoading(false);
                setDone(true);
                source.close();
                return;
            });

            const tempAssistantMessage = {
                role: "assistant",
                content: "",
                model: chatPayload.model,
            };
            const updatedMessages = [...messages, tempAssistantMessage];
            setMessages(updatedMessages);
            const tempIndex = updatedMessages.length - 1;

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
        } catch (error) {
            console.error("An unexpected error occurred:", error);
            alert("An unexpected error occurred. Please try again later.");
            setLoading(false);
            setDone(true);
        }
    };

    // Use the custom hook for effects
    useChatEffects(
        response,
        userInput,
        initChatPayload,
        chatPayload,
        models,
        fetchModels,
        submitQuestionStream,
        setMessages,
        setIsSaveEnabled
    );

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
                    userInput,
                    selectedImage,
                    files,
                    done,
                    selectedDocument,
                    csvContent,
                    expand,
                    initChatPayload,
                    isSaveEnabled,
                    models,
                    fetchModels,
                    setCsvContent,
                    setFiles,
                    resetChat,
                    setChats,
                    setMessages,
                    setImages,
                    setChatPayload,
                    sendChatPayload,
                    deleteChat,
                    findChat,
                    renderConversation,
                    setUserInput,
                    setSelectedImage,
                    handleImageClick,
                    fetchChats,
                    adjustHeight,
                    setDone,
                    setSelectedDocument,
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
                models,
                images,
                chatPayload,
                selectedImage,
                files,
                selectedDocument,
                csvContent,
                initChatPayload,
                isSaveEnabled,
            ])}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext(): any {
    return useContext(ChatContext);
}
