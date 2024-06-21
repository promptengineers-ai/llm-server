import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { useChatContext } from "@/contexts/ChatContext";

interface Tool {
    name: string;
    value: string;
    description: string;
    link: string;
    enabled: boolean;
}

const ToolDisclosure = ({ title, tools }: { title: string; tools: Tool[] }) => {
    const { chatPayload, setChatPayload } = useChatContext();

    const toggleTool = (toolValue: string) => {
        setChatPayload((prevPayload: any) => {
            const isToolEnabled = prevPayload.tools.includes(toolValue);
            const updatedTools = isToolEnabled
                ? prevPayload.tools.filter((tool: string) => tool !== toolValue)
                : [...prevPayload.tools, toolValue];

            return {
                ...prevPayload,
                tools: updatedTools,
            };
        });
    };

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
                                        className="text-blue-500 underline"
                                    >
                                        {tool.name}
                                    </a>
                                </div>
                                <div className="text-sm overflow-hidden overflow-ellipsis h-[60px] line-clamp-3">
                                    {tool.description}
                                </div>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={chatPayload.tools.includes(
                                        tool.value
                                    )}
                                    className="mr-2"
                                    onChange={() => toggleTool(tool.value)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default ToolDisclosure;
