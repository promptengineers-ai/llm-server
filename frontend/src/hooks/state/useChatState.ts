// https://chatgpt.com/share/9da3c401-7e86-4ad9-a635-2729a0d015d5
import { API_URL, ON_PREM } from "@/config/app";
import { Default } from "@/config/default";
import { useAppContext } from "@/contexts/AppContext";
import { LLM, Message, Tool } from "@/types/chat";
import { EmbeddingModel, ModelType, SearchProvider, SearchType, acceptRagSystemMessage } from "@/types/llm";
import { ChatClient } from "@/utils/api";
import { combinePrompts, parseCSV, shallowUrl } from "@/utils/chat";
import { log } from "@/utils/log";
import { generateRandomNumber } from "@/utils/random";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { SSE } from "sse.js";

const chatClient = new ChatClient();

export const defaultState = {
    chatInputRef: null,
    chatboxRef: null,
    userInputRef: null,
    responseRef: "",
    response: "",
    userInput: "",
    models: [],
    chats: [],
    messages: [],
    images: [],
    files: [],
    actions: [],
    logs: [],
    tools: [],
    loaders: [],
    expand: false,
    done: true,
    selectedImage: null,
    selectedDocument: null,
    csvContent: null,
    isSaveEnabled: false,
    chatPayload: {
        query: "",
        history_id: "",
        system: Default.SYSTEM_MESSAGE + Default.DETAILED_INSTRUCTIONS,
        model: ON_PREM
            ? ModelType.OLLAMA_LLAMA_3_CHAT
            : ModelType.OPENAI_GPT_4_OMNI,
        temperature: 0.5,
        tools: [],
        retrieval: {
            provider: SearchProvider.REDIS,
            embedding: ON_PREM
                ? EmbeddingModel.OLLAMA_NOMIC_EMBED_TEXT
                : EmbeddingModel.OPENAI_TEXT_EMBED_3_LARGE,
            index_name: "",
            search_type: SearchType.MMR,
            search_kwargs: {
                k: 20,
                fetch_k: null,
                score_threshold: null,
            },
            batch_size: 32,
            parallel: false,
            workers: 4,
        },
    },
    status: {
        task_id: null,
        step: "",
        progress: 0,
        message: "",
        page_number: 1,
        page_count: 1,
        chunk_count: 0,
    },
};

export const useChatState = () => {
    const {setLoading} = useAppContext();
    const searchParams = useSearchParams();
    const chatInputRef = useRef<HTMLInputElement | null>(defaultState.chatInputRef);
    const chatboxRef = useRef<HTMLInputElement | null>(defaultState.chatboxRef);
    const userInputRef = useRef<HTMLInputElement | null>(defaultState.userInputRef);
    const responseRef = useRef(defaultState.responseRef);
    const [done, setDone] = useState(defaultState.done);
    const [expand, setExpand] = useState(defaultState.expand);
    const [isSaveEnabled, setIsSaveEnabled] = useState(defaultState.isSaveEnabled);
    const [selectedImage, setSelectedImage] = useState<string | null>(defaultState.selectedImage);
    const [selectedDocument, setSelectedDocument] = useState<any | null>(defaultState.selectedDocument);
    const [csvContent, setCsvContent] = useState<string[][] | null>(defaultState.csvContent);
    const [chats, setChats] = useState<any[]>(defaultState.chats);
    const [messages, setMessages] = useState<Message[]>(defaultState.messages);
    const [images, setImages] = useState<any[]>(defaultState.images);
    const [files, setFiles] = useState<any[]>(defaultState.files);
    const [actions, setActions] = useState<any[]>(defaultState.actions);
    const [logs, setLogs] = useState<any[]>(defaultState.logs);
    const [tools, setTools] = useState<Tool[]>(defaultState.tools);
    const [loaders, setLoaders] = useState<Tool[]>(defaultState.loaders);
    const [userInput, setUserInput] = useState(defaultState.userInput);
    const [response, setResponse] = useState(defaultState.response);
    const [models, setModels] = useState<LLM[]>(defaultState.models);
    const [chatPayload, setChatPayload] = useState(defaultState.chatPayload);
    const [status, setStatus] = useState(defaultState.status);
    const [initChatPayload, setInitChatPayload] = useState({
        system: chatPayload.system,
        retrieval: chatPayload.retrieval,
        tools: chatPayload.tools,
    });
    const [sseSource, setSseSource] = useState<SSE | null>(null);

    const abortSseRequest = (e: any) => {
        e.preventDefault();
        if (sseSource) {
            sseSource.close();
            setDone(true);
            setLoading(false);
            setSseSource(null);
            console.log("SSE request aborted");
        }
    };

    function resetOnCancel(clear: boolean = false) {
        sessionStorage.removeItem("system");
        sessionStorage.removeItem("provider");
        sessionStorage.removeItem("embedding");
        sessionStorage.removeItem("search_type");
        sessionStorage.removeItem("k");
        sessionStorage.removeItem("fetch_k");
        if (clear) {
            sessionStorage.removeItem("tools");
        } else {
            sessionStorage.setItem("tools", JSON.stringify(chatPayload.tools));
        }
    }

    const fetchModels = async () => {
        const res = await chatClient.listModels();
        setModels(
            res.models.sort((a: LLM, b: LLM) =>
                a.model_name.localeCompare(b.model_name)
            )
        );
    };

    const fetchChats = async () => {
        try {
            const data = await chatClient.list();
            setChats(data.chats);
        } catch (err) {
            alert(err);
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

    const sendChatPayload = async (event: any) => {
        event.preventDefault();
        setDone(false);

        const messageContent: Message = { role: "user", content: userInput };

        if (images.length > 0) {
            messageContent.images = images.map((image) => image.src);
        }

        if (files.length > 0) {
            messageContent.sources = files.map((file) => file);
        }

        setMessages([...messages, messageContent]);
        setLogs([]);
        setImages([]);
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
            // setMessages([...newMessages, messageAtIndex]);
            setUserInput(messageAtIndex.content);
            // submitQuestionStream();
        }, 200);
    };

    const resetChat = (event: any) => {
        event.preventDefault();
        setUserInput("");
        shallowUrl("/chat");
        setMessages([]);
        setActions([]);
        setLogs([]);
        resetOnCancel(true);
        setChatPayload({
            ...chatPayload,
            query: "",
            history_id: "",
            retrieval: {
                ...chatPayload.retrieval,
                index_name: "",
            },
            tools: [],
        });
        setDone(true);
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

    const submitCleanUp = () => {
        setChatPayload({ ...chatPayload, query: "" });
        setUserInput("");
        chatInputRef.current?.focus();
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

    const adjustHeight = (height?: string) => {
        const textarea = chatInputRef.current as unknown as HTMLTextAreaElement; // Type assertion
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = height
                ? height
                : `${textarea.scrollHeight}px`;
        }
    };

    const createIndex = (e: any) => {
        return new Promise<void>(async (resolve, reject) => {
            e.preventDefault();

            // If index exists, use it, otherwise generate a random number
            const index_name =
                chatPayload.retrieval.index_name ||
                generateRandomNumber().toString();

            setStatus((prev: any) => ({ ...prev, task_id: index_name }));
            try {
                const chatClient = new ChatClient();
                const docs = await chatClient.createDocuments({ data: files, task_id: index_name });
                await chatClient.upsert({
                    task_id: index_name,
                    documents: docs.documents,
                    index_name: index_name,
                    provider: chatPayload.retrieval.provider,
                    embedding: chatPayload.retrieval.embedding,
                });
                setChatPayload((prev: any) => ({
                    ...prev,
                    retrieval: {
                        ...prev.retrieval,
                        index_name: index_name,
                    },
                }));
                setFiles([]);
                resolve();
            } catch (error) {
                console.error(error);
                alert("Error uploading the file");
                reject(error);
            }
        });
    };

    const submitQuestionStream = async () => {

        try {
            // setDone(false);
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

            setSseSource(source);

            let streamTimeout: ReturnType<typeof setTimeout>;

            const resetStreamTimeout = () => {
                clearTimeout(streamTimeout);
                streamTimeout = setTimeout(() => {
                    console.error("Stream timed out. Closing connection.");
                    if (!done) {
                        setDone(true);
                        source.close();
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
                    }
                }, 5 * 1000);
            };

            source.addEventListener("error", (e: any) => {
                console.error("Error received from server:", e);
                setLoading(false);
                setDone(true);
                const errData = JSON.parse(e?.data);
                alert(errData?.detail);
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
                // resetStreamTimeout();
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

                        if ("tool" in objectsArray[0]) {
                            setActions((prevActions) => [
                                ...prevActions,
                                objectsArray[0],
                            ]);
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

    return {
        // Constants
        defaultState,
        // Refs
        chatInputRef,
        chatboxRef,
        userInputRef,
        responseRef,
        // States
        loaders,
        setLoaders,
        actions,
        setActions,
        logs,
        setLogs,
        tools,
        setTools,
        done,
        setDone,
        expand,
        setExpand,
        response,
        setResponse,
        isSaveEnabled,
        setIsSaveEnabled,
        selectedImage,
        setSelectedImage,
        selectedDocument,
        setSelectedDocument,
        csvContent,
        setCsvContent,
        chats,
        setChats,
        messages,
        setMessages,
        images,
        setImages,
        files,
        setFiles,
        userInput,
        setUserInput,
        models,
        setModels,
        chatPayload,
        setChatPayload,
        initChatPayload,
        setInitChatPayload,
        status,
        setStatus,
        // Mutations
        fetchModels,
        fetchChats,
        deleteChat,
        handleImageClick,
        sendChatPayload,
        handleRegenerateClick,
        resetChat,
        resetOnCancel,
        handleDocumentClick,
        submitCleanUp,
        updateMessages,
        adjustHeight,
        submitQuestionStream,
        abortSseRequest,
        createIndex,
    };
};
