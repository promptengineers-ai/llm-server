export type Message = {
    role: string;
    content: string;
    actions?: any[];
    documents?: any[];
    images?: string[];
};

export type ChatContextType = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    chatboxRef: React.MutableRefObject<HTMLInputElement | null>;
    chatInputRef: React.MutableRefObject<HTMLInputElement | null>;
    userInputRef: React.MutableRefObject<HTMLInputElement | null>;
    chats: any[];
    setChats: (chats: any[]) => void;
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    sendChatPayload: (event: any) => void;
    chatPayload: { query: string; history_id: string };
    setChatPayload: (payload: any) => void;
    handleChatboxClick: (e: MouseEvent) => void;
    chatboxRefIsEmpty: boolean;
    setChatboxRefIsEmpty: (isEmpty: boolean) => void;
    resetChat: (event: any) => void;
};

export type Welcome = {
    heading: string;
    paragraph: string;
    buttons: { label: string; href: string }[];
};