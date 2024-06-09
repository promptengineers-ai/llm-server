import { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { useChatContext } from "@/contexts/ChatContext";
import {
    Dialog,
    DialogPanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from "@headlessui/react";
import { ChatPayload } from "@/types/chat";
import RetrievalForm from "../forms/RetrievalForm";

const CustomizeModal = () => {
    const { isOpen, setIsOpen, setIsPopoverOpen, setIsDrawerOpen } =
        useAppContext();
    const { chatPayload, setChatPayload, initChatPayload, setInitChatPayload, isSaveEnabled } = useChatContext();

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 cursor-pointer"
            style={{ zIndex: 1000 }}
        >
            <Dialog open={true} onClose={() => {}} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg border bg-white rounded-2xl w-full">
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
                        <div className="flex-grow overflow-y-auto p-4">
                            <div className="max-h-[60vh] overflow-y-auto md:max-h-[calc(100vh-300px)]">
                                <TabGroup>
                                    <TabList className="flex gap-2">
                                        <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white">
                                            Instructions
                                        </Tab>
                                        <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white">
                                            Retrieval
                                        </Tab>
                                        <Tab
                                            disabled
                                            className="disabled:opacity-50 rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                        >
                                            Tools
                                        </Tab>
                                    </TabList>
                                    <TabPanels className={"mt-3"}>
                                        <TabPanel>
                                            <p className="mt-1 mb-2 text-sm">
                                                What would you like ChatGPT to
                                                know about you to provide better
                                                responses?
                                            </p>
                                            <textarea
                                                className="w-full resize-y rounded-sm p-2 placeholder:text-gray-300 border text-sm"
                                                rows={6}
                                                value={initChatPayload.system}
                                                onChange={(e) =>
                                                    setInitChatPayload((prev: ChatPayload) => ({
                                                        ...prev,
                                                        system: e.target.value,
                                                    }))
                                                }
                                            />
                                        </TabPanel>
                                        <TabPanel>
                                            <RetrievalForm />
                                        </TabPanel>
                                        {/* <TabPanel>Content 3</TabPanel> */}
                                    </TabPanels>
                                </TabGroup>
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
                                            setInitChatPayload(
                                                (prev: ChatPayload) => ({
                                                    ...prev,
                                                    system: chatPayload.system,
                                                })
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
                                            ...initChatPayload,
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
