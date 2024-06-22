import { ChatPayload, LLM, Message } from "@/types/chat";
import { formatDate } from "./datetime";

export const constructBubbleMessage = (
    sender: string,
    src?: string,
    label?: string
) => {
    const image = (src: string) => {
        return `<img src=${src} alt="${sender} avatar" />`;
    };

    if (sender === "user")
        return `${src ? image(src) : "👨‍💻 "} ${label ? label : "You"}`;

    return `${src ? image(src) : "🤖 "} ${label ? label : "Assistant"}`;
};

export function filterModels(
    source: { [key: string]: string },
    compare: { [key: string]: string },
    include: boolean = true // True to include common keys, false to exclude them
): { [key: string]: string } {
    const onPremKeys = new Set(Object.keys(compare));
    const resultModels: { [key: string]: string } = {};

    for (const key in source) {
        if (onPremKeys.has(key) === include) {
            // Adjusts based on the include flag
            resultModels[key] = source[key];
        }
    }
    return resultModels;
}

export const prompt = (chatPayload: ChatPayload) => {
    return {
        role: "system",
        content: chatPayload.system + `\n\nCURRENT_DATETIME: ${formatDate()}`,
    };
};

export const combinePrompts = (
    chatPayload: ChatPayload,
    messages: Message[],
    userInput: string
) => {
    const sysPrompt = prompt(chatPayload);
    // const initialUserInput = { role: "user", content: userInput };

    return [sysPrompt, ...messages];
};

export const shallowUrl = (url: string) => {
    window.history.replaceState(
        {
            ...window.history.state,
            as: url,
            url: url,
        },
        "",
        url
    );
};

export const parseCSV = (text: string) => {
    const rows = text.split("\n").map((row) => row.split(","));
    return rows;
};

export const messagesContainsSources = (messages: Message[]) => {
    return messages.some((message) => message.sources);
};