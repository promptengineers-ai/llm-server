import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import ConsoleCard from "../cards/ConsoleCard";

const ActionDisclosure = () => {

    return (
        <Disclosure as="div" className="mb-1">
            <DisclosureButton className="bg-white group flex items-center justify-between px-2 py-1 mt-2 border rounded-md">
                <label className="font-semibold mr-3">Actions</label>
                <FaChevronDown
                    size={12}
                    className="group-data-[open]:rotate-180 mr-1"
                />
            </DisclosureButton>
            <DisclosurePanel className="text-gray-500 w-full">
                <ConsoleCard />
            </DisclosurePanel>
        </Disclosure>
    );
};

export default ActionDisclosure;
