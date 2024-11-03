"use client";
import { useContext, createContext } from "react";
import { IContextProvider } from "../interfaces/provider";
import { useToolState } from "@/hooks/state/useToolState";

export const ToolContext = createContext({
    tool: {
        name: "",
        description: "",
        link: "",
        method: "GET",
        toolkit: "API",
        url: "",
        headers: {},
        args: {},
    },
});

export default function ToolProvider({ children }: IContextProvider) {
    const toolState = useToolState();

    return (
        <ToolContext.Provider value={toolState}>
            {children}
        </ToolContext.Provider>
    );
}

export function useToolContext(): any {
    return useContext(ToolContext);
}
