import { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { useChatContext } from "@/contexts/ChatContext";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import {
    Description,
    Field,
    Fieldset,
    Input,
    Label,
    Legend,
    Select,
    Textarea,
} from "@headlessui/react";
import { ChatPayload } from "@/types/chat";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";
import RetrievalForm from "../forms/RetrievalForm";

const CustomizeModal = () => {
    const { isOpen, setIsOpen, setIsPopoverOpen, setIsDrawerOpen } =
        useAppContext();
    const { chatPayload, setChatPayload } = useChatContext();

    const [textareaValue, setTextareaValue] = useState(chatPayload.system);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    useEffect(() => {
        if (textareaValue !== chatPayload.system) {
            setIsSaveEnabled(true);
        } else {
            setIsSaveEnabled(false);
        }
    }, [textareaValue, chatPayload.system]);

    useEffect(() => {
        setTextareaValue(chatPayload.system);
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 cursor-pointer"
            style={{ zIndex: 1000 }}
            // onClick={() => {
            //     setIsOpen(false);
            //     setIsDrawerOpen(true);
            //     setIsPopoverOpen(false);
            // }}
        >
            <Dialog open={true} onClose={() => {}} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg border bg-white rounded-2xl">
                        <div className="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10">
                            <div className="flex">
                                <div className="flex items-center">
                                    <div className="flex grow flex-col gap-1">
                                        <h2
                                            id="radix-:re0:"
                                            className="text-lg font-semibold leading-6 text-token-text-primary"
                                        >
                                            Customize
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                            <div className="max-h-[60vh] overflow-y-auto md:max-h-[calc(100vh-300px)]">
                                <DialogTitle className="font-bold">
                                    Custom Instructions
                                </DialogTitle>
                                <p className="mt-1 mb-2 text-sm">
                                    What would you like ChatGPT to know about
                                    you to provide better responses?
                                </p>
                                <textarea
                                    className="w-full resize-y rounded-sm p-2 placeholder:text-gray-300 border text-sm"
                                    rows={6}
                                    value={textareaValue}
                                    onChange={(e) =>
                                        setTextareaValue(e.target.value)
                                    }
                                />
                                <Disclosure as="div" className="py-3">
                                    <DisclosureButton className="group flex w-full items-center justify-between">
                                        <DialogTitle className="font-bold">
                                            Retrieval
                                        </DialogTitle>
                                        <FaChevronDown
                                            size={"10px"}
                                            className="size-5 group-data-[open]:rotate-180"
                                        />
                                    </DisclosureButton>
                                    <DisclosurePanel
                                        className={
                                            "mt-3"
                                        }
                                    >
                                        <RetrievalForm />
                                    </DisclosurePanel>
                                </Disclosure>
                            </div>
                            <div className="mt-4 md:mt-5 flex gap-4">
                                <button
                                    onClick={() => {
                                        let confirmCancel = false;
                                        if (isSaveEnabled) {
                                            confirmCancel = confirm(
                                                "Are you sure you want to exit? Any changes you made will be permanently lost."
                                            );
                                        } else {
                                            setIsOpen(false);
                                            setIsDrawerOpen(true);
                                        }
                                        if (confirmCancel) {
                                            setIsOpen(false);
                                            setIsDrawerOpen(true);
                                            setTextareaValue(
                                                chatPayload.system
                                            );
                                        }
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setChatPayload((prev: ChatPayload) => ({
                                            ...prev,
                                            system: textareaValue,
                                        }));
                                        setIsOpen(false);
                                        setIsPopoverOpen(false);
                                    }}
                                    className={`px-4 py-2 rounded-3xl ${
                                        isSaveEnabled
                                            ? "bg-gray-500 text-white"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                    disabled={!isSaveEnabled}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};

export default CustomizeModal;
