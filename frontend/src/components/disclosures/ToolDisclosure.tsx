import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

interface Tool {
    name: string;
    description: string;
    link: string;
    enabled: boolean;
}

const ToolDisclosure = ({ title, tools }: { title: string; tools: Tool[] }) => {
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
                                {/* <div className="hidden group-hover:block absolute bg-gray-800 text-white text-xs rounded-md p-2 shadow-lg z-10 w-full max-w-xs -top-10 transform -translate-y-5">
                                    {tool.description}
                                </div> */}
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={tool.enabled}
                                    className="mr-2"
                                    onChange={() => {}}
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
