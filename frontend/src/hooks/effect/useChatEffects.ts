import { useEffect } from "react";
import equal from "fast-deep-equal/react";
import { Hook, Console, Decode, Unhook } from "console-feed";
import { ChatPayload, LLM, Message } from "@/types/chat";
import { logFilter } from "@/utils/log";
import { HookedConsole } from "console-feed/lib/definitions/Console";

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

export const useUpdateInitChatPayloadEffect = (setInitChatPayload: any) => {
    useEffect(() => {
        const system = sessionStorage.getItem("system");
        if (system) {
            setInitChatPayload((prev: ChatPayload) => ({
                ...prev,
                system,
            }));
        }
    }, []);
};


// TODO: This logFilter mechanism is dirty dirty, and should be replaced with a more robust solution
export const usePrintActionsToLogsEffect = (
    actions: any[],
    setActions: any,
    logs: any[],
    setLogs: any,
    done: boolean
) => {
    useEffect(() => {
        if (actions.length > 0) {
            Hook(
                window.console as HookedConsole,
                (log: any) => {
                    if (logFilter(log, logs)) {
                        setLogs((currentLogs: any[]) => [...currentLogs, log]);
                    }
                },
                false
            );

            for (const action of actions) {
                const message =
                    typeof action.message === "object"
                        ? JSON.stringify(action.message, null, 2)
                        : action.message;
                console.info(
                    `%c[${action.tool}] - ${action.type}:%c ${message}`,
                    "color:white;",
                    "color:#33FF33;"
                );
            }
            
        }
        if (done) {
            Unhook(window.console as HookedConsole);
            setActions([]);
        }
        return () => {
            Unhook(window.console as HookedConsole);
        };
    }, [actions.length, done]);
};