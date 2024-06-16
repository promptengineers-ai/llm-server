// https://chatgpt.com/share/9da3c401-7e86-4ad9-a635-2729a0d015d5
import { ON_PREM } from "@/config/app";
import { Default } from "@/config/default";
import { LLM, Message } from "@/types/chat";
import { EmbeddingModel, ModelType, SearchProvider, SearchType } from "@/types/llm";
import { ChatClient } from "@/utils/api";
import { parseCSV, shallowUrl } from "@/utils/chat";
import { log } from "@/utils/log";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

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
    expand: false,
    done: true,
    selectedImage: null,
    selectedDocument: null,
    csvContent: null,
    isSaveEnabled: false,
    chatPayload: {
        query: "",
        history_id: "",
        system: Default.SYSTEM_MESSAGE,
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
        },
    },
};

export const useChatState = () => {
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
    const [userInput, setUserInput] = useState(defaultState.userInput);
    const [response, setResponse] = useState(defaultState.response);
    const [models, setModels] = useState<LLM[]>(defaultState.models);
    const [chatPayload, setChatPayload] = useState(defaultState.chatPayload);
    const [initChatPayload, setInitChatPayload] = useState({
        system: chatPayload.system,
        retrieval: chatPayload.retrieval,
        tools: chatPayload.tools,
    });

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

    return {
        // Refs
        chatInputRef,
        chatboxRef,
        userInputRef,
        responseRef,
        // States
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
        // Mutations
        fetchModels,
        fetchChats,
        deleteChat,
        handleImageClick,
        sendChatPayload,
        handleRegenerateClick,
        resetChat,
        handleDocumentClick,
        submitCleanUp,
        updateMessages,
        adjustHeight,
    };
};
