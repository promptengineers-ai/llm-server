import { useEffect, useState } from "react";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import ConsoleCard from "../../../../clients/react-vite/src/components/cards/ConsoleCard";
import { useChatContext } from "@/contexts/ChatContext";

const ActionDisclosure = () => {
    const {actions} = useChatContext();
    const [isOpen, setIsOpen] = useState(false);
    const [currentTool, setCurrentTool] = useState<string | null>(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (actions.length > 0) {
            setCurrentTool(actions[0].tool);
        }
    }, [actions]);

    return (
        <Disclosure as="div" className="mb-1">
            <>
                <DisclosureButton
                    className={`bg-white group flex items-center justify-between px-2 py-1 mt-2 border rounded-t-md ${
                        isOpen ? "" : "rounded-b-md"
                    }`}
                    onClick={handleToggle}
                >
                    <label className="font-semibold mr-3">
                        Action {currentTool ? `(${currentTool})` : ""}
                    </label>
                    <FaChevronDown
                        size={12}
                        className={`mr-1 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </DisclosureButton>
                {isOpen && (
                    <DisclosurePanel className="text-gray-500 w-full border-t">
                        <ConsoleCard />
                    </DisclosurePanel>
                )}
            </>
        </Disclosure>
    );
};

export default ActionDisclosure;
