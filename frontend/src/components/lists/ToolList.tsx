import ToolDisclosure from "@/components/disclosures/ToolDisclosure";
import { useChatContext } from "@/contexts/ChatContext";
import { Tool } from "@/types/chat";

const ToolsList = () => {
    const {tools} = useChatContext();
    
    const groupedTools = tools.reduce(
        (acc: { [key: string]: Tool[] }, tool: Tool) => {
            if (!acc[tool.toolkit]) {
                acc[tool.toolkit] = [];
            }
            acc[tool.toolkit].push(tool);
            return acc;
        },
        {}
    );

    return (
        <div>
            {Object.keys(groupedTools).map((toolkit) => (
                <ToolDisclosure
                    key={toolkit}
                    title={toolkit}
                    tools={groupedTools[toolkit]}
                />
            ))}
        </div>
    );
};

export default ToolsList;
