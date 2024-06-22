import { useState } from "react";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import ConsoleCard from "../cards/ConsoleCard";

const ActionDisclosure = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Disclosure as="div" className="mb-1">
            <>
                <DisclosureButton
                    className={`bg-white group flex items-center justify-between px-2 py-1 mt-2 border rounded-t-md ${
                        isOpen ? "" : "rounded-b-md"
                    }`}
                    onClick={handleToggle}
                >
                    <label className="font-semibold mr-3">Actions</label>
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
