import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { useChatContext } from "@/contexts/ChatContext";
import { Tool } from "@/types/chat";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa"; // Import the trash icon
import { useToolContext } from "@/contexts/ToolContext";
import TrashIcon from "../icons/TrashIcon";

const ToolDisclosure = ({ title, tools }: { title: string; tools: Tool[] }) => {
    const { deleteTool } = useToolContext();
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

    return (
        <Disclosure as="div" className="border rounded-md w-full">
            <DisclosureButton className="group flex items-center justify-between p-3 w-full">
                <label className="font-semibold mr-3">{title}</label>
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
                            className="border p-3 rounded-md shadow-sm bg-white flex flex-col justify-between relative group"
                        >
                            <div>
                                <div className="font-bold">
                                    <a
                                        href={tool.link}
                                        target="_blank"
                                        className="text-blue-500 underline"
                                    >
                                        {tool.name}
                                    </a>
                                </div>
                                <div className="text-sm overflow-hidden overflow-ellipsis h-[60px] line-clamp-3">
                                    {tool.description}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <input
                                    type="checkbox"
                                    checked={initChatPayload.tools.includes(
                                        tool.value
                                    )}
                                    className="mr-2"
                                    onChange={() => toggleTool(tool.value)}
                                />
                                <button
                                    className="hover:text-red-700"
                                    onClick={async () => handleDeleteClick(tool)}
                                    title="Delete tool"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default ToolDisclosure;
