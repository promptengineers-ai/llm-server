// https://chatgpt.com/share/9da3c401-7e86-4ad9-a635-2729a0d015d5
import { useChatContext } from "@/contexts/ChatContext";
import { ToolClient } from "@/utils/api";
import { useState } from "react";

const toolClient = new ToolClient();
export const initToolState = {
    tool: {
        id: "",
        type: "",
        name: "",
        description: "",
        link: "",
        method: "GET",
        toolkit: "",
        url: "",
        headers: {},
        args: {},
    },
};

export const useToolState = () => {
    const { setTools, tools } = useChatContext();
    const [tool, setTool] = useState(initToolState.tool);

    const updateToolState = (newState: any) => {
        setTool((prev: any) => ({ ...prev, ...newState }));
    };

    const createTool = async (newTool: any) => {
        await toolClient.create(newTool);
        const res = await toolClient.list();
        setTools(res.tools);
    };

    const updateTool = async (updated: any) => {
        await toolClient.update(updated);
        const res = await toolClient.list();
        setTools(res.tools);
    };

    const deleteTool = async (tool: any) => {
        await toolClient.delete(tool);
        const res = await toolClient.list();
        setTools(res.tools);
    };

    const fetchToolkits = () => {
        const toolkits = tools.map((tool: any) => ({
            id: tool.toolkit,
            name: tool.toolkit,
        }));

        const uniqueToolkits = Array.from(
            new Set(toolkits.map((toolkit: any) => toolkit.id))
        ).map((id) => {
            return toolkits.find((toolkit: any) => toolkit.id === id);
        });

        return uniqueToolkits;
    };

    return {
        tool,
        setTool,
        updateToolState,
        createTool,
        updateTool,
        deleteTool,
        fetchToolkits,
    };
};
