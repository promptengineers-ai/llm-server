import { Dialog } from "@headlessui/react";
import { useAppContext } from "@/contexts/AppContext";
import { useState } from "react";
import RetrievalForm from "../forms/RetrievalForm";

const CustomizeModal = () => {
    const { isCustomizeOpen, setIsCustomizeOpen } = useAppContext();

    return (
        <Dialog
            open={isCustomizeOpen}
            onClose={() => setIsCustomizeOpen(false)}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-4">
                    <Dialog.Title className="text-lg font-medium">
                        Configure RAG
                    </Dialog.Title>
                    <RetrievalForm />
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default CustomizeModal;
