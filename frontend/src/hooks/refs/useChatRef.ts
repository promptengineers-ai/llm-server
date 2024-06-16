import { useRef } from "react";

export const useChatRef = () => {
    const responseRef = useRef("");
    const userInputRef = useRef<HTMLInputElement | null>(null);
    const chatInputRef = useRef<HTMLInputElement | null>(null);
    const chatboxRef = useRef<HTMLInputElement | null>(null);

    return {
        responseRef,
        userInputRef,
        chatInputRef,
        chatboxRef,
    };
};
