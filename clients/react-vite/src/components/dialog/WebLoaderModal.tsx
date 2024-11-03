import { Dialog, DialogPanel, Field, Fieldset, Select } from "@headlessui/react";
import { useAppContext } from "@/contexts/AppContext";
import { useState } from "react";
import GitbookLoaderForm from "../forms/loaders/GitbookLoaderForm";
import TextLoaderForm from "../forms/loaders/TextLoaderForm";
import { Loader } from "@/types/chat";
import { useChatContext } from "@/contexts/ChatContext";
import { FaSpinner } from "react-icons/fa";
import { capitalizeFirstLetter } from "@/utils/chat";

export function FormSelector({ loader }: { loader: Loader }) {
    if (loader === "text") return <TextLoaderForm />;
    if (loader === "gitbook") return <GitbookLoaderForm />;
}

const WebLoaderModal = () => {
    const {
        isWebLoaderOpen,
        setIsWebLoaderOpen,
    } = useAppContext();
    const { loaders, setLoaders, createIndexFromLoaders, status } = useChatContext();
    // const [disabled, setDisabled] = useState<boolean>(false);
    const [loader, setLoader] = useState<Loader>("text");

    const createIndex = async (e: any) => {
        if (loaders.length > 0) {
            await createIndexFromLoaders(e);
        }
    };

    if (!isWebLoaderOpen) {
        return null;
    }

    const handleSuffix = (step: string) => {
        if (step === "scrape") {
            return "Scraping...";
        } else if (step === "split") {
            return "Splitting...";
        }
        return "Uploading...";
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 cursor-pointer"
            style={{ zIndex: 1000 }}
        >
            <Dialog open={true} onClose={() => {}} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg border bg-white rounded-2xl w-full">
                        <div className="px-4 pb-4 pt-5 sm:p-6 sm:py-3 flex items-center justify-between border-b border-black/10 dark:border-white/10">
                            <div className="flex">
                                <div className="flex items-center">
                                    <div className="flex grow flex-col gap-1">
                                        <h2
                                            id="radix-:re0:"
                                            className="text-lg font-semibold leading-6 text-token-text-primary"
                                        >
                                            Web Documents
                                        </h2>
                                        {status.message && <small>{status.message}</small>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto p-4">
                            <Fieldset className={"mb-2"}>
                                <Field className={"border rounded-md p-2"}>
                                    <label className="font-semibold">
                                        Loader
                                    </label>
                                    <p className="text-xs text-slate/50">
                                        Choose the loader for web documents.
                                    </p>
                                    <Select
                                        name="loader"
                                        aria-label="Loader"
                                        className="p-1 border rounded-md w-full mt-1"
                                        onChange={(e) => {
                                            setLoader(e.target.value as Loader);
                                        }}
                                    >
                                        <option value="text">Text</option>
                                        <option value="gitbook">Gitbook</option>
                                    </Select>
                                </Field>
                            </Fieldset>
                            <FormSelector loader={loader} />
                            <div className="mt-4 md:mt-5 flex gap-4">
                                <button
                                    onClick={() => {
                                        setIsWebLoaderOpen(false);
                                        setLoaders([]);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createIndex}
                                    className={`px-4 py-2 rounded-3xl ${
                                        loaders.length > 0 && !status.step
                                            ? "bg-gray-500 text-white"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                    disabled={status.step ? true : false}
                                >
                                    {status.step ? (
                                        <div className="flex items-center">
                                            <FaSpinner
                                                className="animate-spin"
                                                fontSize={18}
                                            />
                                            <span className="ml-2">
                                                {capitalizeFirstLetter(handleSuffix(status.step))}{" "}
                                                {status.progress !== 0 &&
                                                    status.progress + "%"}
                                            </span>
                                        </div>
                                    ) : (
                                        "Load"
                                    )}
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};

export default WebLoaderModal;
