import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { FaChevronDown, FaCheck, FaTimes } from "react-icons/fa";
import { useChatContext } from "@/contexts/ChatContext";
import { Tool } from "@/types/chat";
import { useEffect } from "react";
import { useToolContext } from "@/contexts/ToolContext";
import TrashIcon from "../icons/TrashIcon";
import EditIcon from "../icons/EditIcon";
import { useAppContext } from "@/contexts/AppContext";
import { ToolClient } from "@/utils/api";

const toolClient = new ToolClient();

const ToolDisclosure = ({ title, tools }: { title: string; tools: Tool[] }) => {
    const { setIsCustomizeOpen, setIsNewToolOpen } = useAppContext();
    const { deleteTool, updateToolState, setInitTool } = useToolContext();
    const { initChatPayload, setInitChatPayload, setChatPayload } =
        useChatContext();

    const toggleTool = (toolValue: string) => {
        setInitChatPayload((prevPayload: any) => {
            const isToolEnabled = prevPayload.tools.includes(toolValue);
            const updatedTools = isToolEnabled
                ? prevPayload.tools.filter((tool: string) => tool !== toolValue)
                : [...prevPayload.tools, toolValue];

            sessionStorage.setItem("tools", JSON.stringify(updatedTools));

            return {
                ...prevPayload,
                tools: updatedTools,
            };
        });
    };

    const handleDeleteClick = async (tool: any) => {
        const confirmDelete = confirm(
            `Are you sure you want to delete ${tool.name} tool?`
        );
        if (!confirmDelete) {
            return;
        }
        await deleteTool(tool);
    };

    useEffect(() => {
        const savedTools = sessionStorage.getItem("tools");
        if (savedTools) {
            const parsedTools = JSON.parse(savedTools);
            setInitChatPayload((prevPayload: any) => ({
                ...prevPayload,
                tools: parsedTools,
            }));
            setChatPayload((prevPayload: any) => ({
                ...prevPayload,
                tools: parsedTools,
            }));
        }
    }, [setInitChatPayload]);

    const enabledCount = tools.filter(tool => 
        initChatPayload.tools.includes(tool.value)
    ).length;

    const toggleAllTools = (e: React.MouseEvent) => {
        e.stopPropagation();
        setInitChatPayload((prevPayload: any) => {
            const otherTools = prevPayload.tools.filter(
                (tool: string) => !tools.some(groupTool => groupTool.value === tool)
            );
            
            const updatedTools = enabledCount === tools.length
                ? otherTools  // Deselect all in group
                : [...otherTools, ...tools.map(tool => tool.value)];  // Select all in group
            
            sessionStorage.setItem("tools", JSON.stringify(updatedTools));
            
            return {
                ...prevPayload,
                tools: updatedTools,
            };
        });
    };

    return (
        <Disclosure as="div" className="border rounded-md w-full">
            <DisclosureButton className="group flex items-center justify-between p-3 w-full">
                <div className="flex items-center">
                    <label className="font-semibold mr-3">{title}</label>
                    <span className="text-sm text-gray-500">({enabledCount} enabled)</span>
                    <button
                        onClick={toggleAllTools}
                        className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        title={enabledCount === tools.length ? "Deselect all tools in this group" : "Select all tools in this group"}
                    >
                        {enabledCount === tools.length ? (
                            <FaTimes size={12} />
                        ) : (
                            <FaCheck size={12} />
                        )}
                    </button>
                </div>
                <FaChevronDown
                    size={12}
                    className="group-data-[open]:rotate-180 mr-1"
                />
            </DisclosureButton>
            <DisclosurePanel className="text-gray-500 p-3 w-full">
                <ul className="grid grid-cols-2 gap-4">
                    {tools.map((tool, index) => (
                        <li
                            key={index}
                            onClick={() => toggleTool(tool.value)}
                            className={`border p-3 rounded-md shadow-sm flex flex-col justify-between relative group cursor-pointer transition-colors ${
                                initChatPayload.tools.includes(tool.value)
                                    ? "bg-gray-200"
                                    : "bg-white"
                            }`}
                        >
                            <div>
                                <div className="font-bold">
                                    <a
                                        href={tool.link}
                                        target="_blank"
                                        className="text-blue-500 underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {tool.name}
                                    </a>
                                </div>
                                <div className="text-sm overflow-hidden overflow-ellipsis h-[60px] line-clamp-3">
                                    {tool.description}
                                </div>
                            </div>
                            {tool.id && (
                                <div className="flex justify-end mt-2">
                                    <div className="flex space-x-2">
                                        <button
                                            className="hover:text-blue-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsCustomizeOpen(false);
                                                setIsNewToolOpen(true);
                                                toolClient.find(tool).then((item) => {
                                                    updateToolState(item.tool);
                                                    setInitTool(item.tool);
                                                });
                                            }}
                                            title="Edit tool"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            className="hover:text-red-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(tool);
                                            }}
                                            title="Delete tool"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default ToolDisclosure;
