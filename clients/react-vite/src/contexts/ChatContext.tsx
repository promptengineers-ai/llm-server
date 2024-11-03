"use client";
import { useContext, createContext, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChatClient } from "../utils/api";
import { Message, ChatPayload, LLM } from "../types/chat";
import { IContextProvider } from "../interfaces/provider";
import { constructBubbleMessage } from "@/utils/chat";
import { userMessageTitleStyle } from "@/config/message";
import { useAppContext } from "./AppContext";
import { useChatState } from "@/hooks/state/useChatState";
import ResponseToolBar from "@/components/sections/ResponseToolBar";
import MarkdownCard from "@/components/cards/MarkdownCard";
import ImageList from "@/components/lists/ImageList";
import SourceList from "@/components/lists/SourceList";
import ActionDisclosure from "@/components/disclosures/ActionDisclosure";
import { generateRandomNumber } from "@/utils/random";

interface ChatContextType {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    selectedModel: LLM;
    setSelectedModel: (model: LLM) => void;
    loading: boolean;
    selectedConversation: string | null;
    // ... add other context properties
}

const ChatContext = createContext<ChatContextType | undefined | any>(undefined);

export function useChatContext() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
}

export default function ChatProvider({ children }: IContextProvider) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const chatClient = useMemo(() => new ChatClient(), []);
    const { setIsPopoverOpen } = useAppContext();

    // States from useChatState hook
    const {
        messages,
        setMessages,
        selectedModel,
        setSelectedModel,
        loading,
        setLoading,
        chatPayload,
        setChatPayload,
        // ... other states
    } = useChatState();

    const findChat = async (chatId: string) => {
        try {
            const res = await chatClient.find(chatId);
            setMessages(res.chat.messages);
            setIsPopoverOpen(false);
            setChatPayload((prev: ChatPayload) => ({
                ...prev,
                system: res.chat.system,
                history_id: chatId,
                retrieval: res.chat.retrieval,
                tools: res.chat.tools,
            }));
            // Update URL with search params
            navigate(`/chat/${chatId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
        } catch (err) {
            console.error(err);
            alert(err);
        }
    };

    // Add other methods like duplicateChat, submitQuestion, etc.

    const value = {
        messages,
        setMessages,
        selectedModel,
        setSelectedModel,
        loading,
        findChat,
        // ... other context values
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
