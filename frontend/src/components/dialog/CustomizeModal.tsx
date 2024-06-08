import { useAppContext } from "@/contexts/AppContext";
import {
    Description,
    Dialog,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";

const CustomizeModal = () => {
    const {isOpen, setIsOpen, setIsPopoverOpen, setIsDrawerOpen} = useAppContext();
    
    if (isOpen) {
        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 cursor-pointer"
                style={{ zIndex: 1000 }}
                onClick={() => {
                    setIsOpen(!isOpen);
                    setIsDrawerOpen(true);
                    setIsPopoverOpen(false);

                }}
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
                                                Customize ChatGPT
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                                <div className="max-h-[60vh] overflow-y-auto md:max-h-[calc(100vh-300px)]">
                                    <DialogTitle className="font-bold">
                                        Deactivate account
                                    </DialogTitle>
                                    <Description>
                                        This will permanently deactivate your
                                        account
                                    </Description>
                                    <p>
                                        Are you sure you want to deactivate your
                                        account? All of your data will be
                                        permanently removed.
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-5 flex gap-4">
                                    <button 
                                        onClick={() => {
                                            setIsOpen(false);
                                            setIsDrawerOpen(true);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button onClick={() => {}}>Deactivate</button>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default CustomizeModal;
