import React, { useEffect, useState } from "react";
import ToolDisclosure from "@/components/disclosures/ToolDisclosure";
import { API_URL } from "@/config/app";

interface Tool {
    name: string;
    value: string;
    description: string;
    link: string;
    enabled: boolean;
    toolkit: string;
}

const ToolsList = () => {
    const [tools, setTools] = useState<Tool[]>([]);

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const response = await fetch(`${API_URL}/tools`);
                const data = await response.json();
                setTools(data.tools);
            } catch (error) {
                console.error("Error fetching tools:", error);
            }
        };

        fetchTools();
    }, []);

    const groupedTools = tools.reduce(
        (acc: { [key: string]: Tool[] }, tool) => {
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
