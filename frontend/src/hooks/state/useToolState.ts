// https://chatgpt.com/share/9da3c401-7e86-4ad9-a635-2729a0d015d5
import { useChatContext } from "@/contexts/ChatContext";
import { ToolClient } from "@/utils/api";
import { useState } from "react";

const toolClient = new ToolClient();
export const initToolState = {
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
};

export const useToolState = () => {
    const { setTools } = useChatContext();
    const [tool, setTool] = useState(initToolState.tool);

    const updateToolState = (newState: any) => {
        setTool((prev: any) => ({ ...prev, ...newState }));
    };

    const createTool = async (newTool: any) => {
        await toolClient.create(newTool);
        const res = await toolClient.list();
        setTools(res.tools);
    };

    const deleteTool = async (tool: any) => {
        await toolClient.delete(tool);
        const res = await toolClient.list();
        setTools(res.tools);
    };

    return {
        tool,
        setTool,
        updateToolState,
        createTool,
        deleteTool,
    };
};
