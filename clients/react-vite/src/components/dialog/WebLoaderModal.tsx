import { Dialog } from "@headlessui/react";
import { useAppContext } from "@/contexts/AppContext";

const WebLoaderModal = () => {
    const { isWebLoaderOpen, setIsWebLoaderOpen } = useAppContext();

    return (
        <Dialog
            open={isWebLoaderOpen}
            onClose={() => setIsWebLoaderOpen(false)}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-4">
                    <Dialog.Title className="text-lg font-medium">
                        Web Loader
                    </Dialog.Title>
                    {/* Add web loader form here */}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default WebLoaderModal;
