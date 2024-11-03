import { useState } from 'react';
import { Message, ChatPayload } from '@/types/chat';
import { defaultState } from '@/config/chat';

export const useChatState = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedModel, setSelectedModel] = useState(defaultState.selectedModel);
    const [loading, setLoading] = useState(false);
    const [chatPayload, setChatPayload] = useState<ChatPayload>(defaultState.chatPayload);
    
    return {
        messages,
        setMessages,
        selectedModel,
        setSelectedModel,
        loading,
        setLoading,
        chatPayload,
        setChatPayload,
    };
};
