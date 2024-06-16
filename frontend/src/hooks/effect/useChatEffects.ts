import { useEffect } from "react";
import equal from "fast-deep-equal/react";
import { ChatPayload, LLM, Message } from "@/types/chat";

export const useFetchModelsEffect = (models: LLM[], fetchModels: any) => {
    useEffect(() => {
        if (models.length === 0) {
            fetchModels();
        }

        return () => {
            // Cleanup logic if needed
        };
    }, []);
};

export const useCheckIfSaveEnabledEffect = (
    initChatPayload: any,
    chatPayload: ChatPayload,
    setIsSaveEnabled: any
) => {
    useEffect(() => {
        if (
            !equal(initChatPayload, {
                system: chatPayload.system,
                retrieval: chatPayload.retrieval,
                tools: chatPayload.tools,
            })
        ) {
            setIsSaveEnabled(true);
        } else {
            setIsSaveEnabled(false);
        }

        return () => {
            // Cleanup logic if needed
        };
    }, [initChatPayload, chatPayload]);
};

export const useUpdateMessageOnResponesEffect = (
    response: string,
    chatPayload: ChatPayload,
    setMessages: any
) => {
    useEffect(() => {
        response.length &&
            setMessages((prev: Message[]) => {
                const lastMessage = prev[prev.length - 1];

                if (lastMessage && lastMessage.role === "assistant") {
                    // Update the last message from the assistant with the new content
                    return prev.map((item: Message, index: number) =>
                        index === prev.length - 1
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
                        ...prev,
                        {
                            role: "assistant",
                            content: response,
                            model: chatPayload.model,
                        },
                    ];
                }
            });
        return () => {
            // Cleanup logic if needed
        };
    }, [response]);
};

export const useSubmitQuestionStreamEffect = (
    userInput: string,
    messages: Message[],
    done: boolean,
    submitQuestionStream: any
) => {
    useEffect(() => {
        if (userInput.length && !done) {
            submitQuestionStream();
        }

        return () => {
            // Cleanup logic if needed
        };
    }, [messages]);
};
