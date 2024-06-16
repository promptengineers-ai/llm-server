import { useEffect } from "react";
import equal from "fast-deep-equal";
import { ChatPayload, LLM } from "@/types/chat";

const useChatEffects = (
    response: string,
    userInput: string,
    initChatPayload: any,
    chatPayload: ChatPayload,
    models: LLM[],
    fetchModels: any,
    submitQuestionStream: any,
    setMessages: any,
    setIsSaveEnabled: any
) => {
    useEffect(() => {
        if (response.length) {
            setMessages((prevConversationContext: any) => {
                const lastMessage =
                    prevConversationContext[prevConversationContext.length - 1];

                if (lastMessage && lastMessage.role === "assistant") {
                    // Update the last message from the assistant with the new content
                    return prevConversationContext.map((item: any, index: number) =>
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
        }
    }, [response, setMessages, chatPayload.model]);

    useEffect(() => {
        if (userInput.length) {
            submitQuestionStream();
        }
    }, [userInput, submitQuestionStream]);

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
    }, [initChatPayload, chatPayload, setIsSaveEnabled]);

    useEffect(() => {
        if (models.length === 0) {
            fetchModels();
        }
    }, [models, fetchModels]);
};

export default useChatEffects;
