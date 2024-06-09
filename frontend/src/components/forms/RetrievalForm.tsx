import { ON_PREM } from "@/config/app";
import { useChatContext } from "@/contexts/ChatContext";
import { ChatPayload } from "@/types/chat";
import { embeddingModels, onPremModels } from "@/types/llm";
import { filterModels } from "@/utils/chat";
import {
    Field,
    Fieldset,
    Select,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    DialogTitle,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

const RetrievalForm = () => {
    const {initChatPayload, setInitChatPayload} = useChatContext();
    const models = (
         ON_PREM
        ? filterModels(embeddingModels, onPremModels)
        : embeddingModels
    );
    return (
        <>
            <Fieldset>
                <Field className={"border px-2 rounded-md p-3"}>
                    <label className="font-semibold">Provider</label>
                    <p className="text-xs text-slate/50">
                        Choose the provider for the retrieval process.
                    </p>
                    <Select
                        name="provider"
                        aria-label="Provider"
                        className="p-1 border rounded-md w-full mt-1"
                        onChange={(e) =>
                            setInitChatPayload((prev: ChatPayload) => ({
                                ...prev,
                                retrieval: {
                                    ...prev.retrieval,
                                    provider: e.target.value,
                                },
                            }))
                        }
                        value={initChatPayload.retrieval.provider}
                    >
                        <option value="redis">Redis</option>
                        {!ON_PREM && <option value="pinecone">Pinecone</option>}
                        <option value="mongo" disabled className="bg-gray-200">
                            Mongo
                        </option>
                    </Select>
                </Field>
                <Field className={"border px-2 rounded-md p-3 mt-4"}>
                    <label className="font-semibold">Embedding</label>
                    <p className="text-xs text-slate/50">
                        Choose the embedding model for retrieval.
                    </p>
                    <Select
                        name="embedding"
                        aria-label="Embedding"
                        className="p-1 border rounded-md w-full mt-1"
                        onChange={(e) =>
                            setInitChatPayload((prev: ChatPayload) => ({
                                ...prev,
                                retrieval: {
                                    ...prev.retrieval,
                                    embedding: e.target.value,
                                },
                            }))
                        }
                        value={initChatPayload.retrieval.embedding}
                    >
                        {Object.entries(models).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </Select>
                </Field>
            </Fieldset>

            <Disclosure>
                <DisclosureButton className="group flex items-center justify-between px-2 py-1 my-2 border rounded-md">
                    <label className="font-semibold mr-3">Search</label>
                    <FaChevronDown
                        size={12}
                        className="group-data-[open]:rotate-180 mr-1"
                    />
                </DisclosureButton>
                <DisclosurePanel className="mt-1">
                    <Fieldset className={"columns-2"}>
                        <Field className={"border px-2 rounded-md p-3"}>
                            <label className="font-semibold">Search Type</label>
                            <p className="text-xs text-slate/50">
                                Vector search algorithm to retrieve docs.
                            </p>
                            <Select
                                name="provider"
                                aria-label="Provider"
                                className="p-1 border rounded-md w-full mt-1"
                                value={initChatPayload.retrieval.search_type}
                                onChange={(e) =>
                                    setInitChatPayload((prev: ChatPayload) => ({
                                        ...prev,
                                        retrieval: {
                                            ...prev.retrieval,
                                            search_type: e.target.value,
                                        },
                                    }))
                                }
                            >
                                <option value="similarity">Similarity</option>
                                <option value="mmr">MMR</option>
                                <option value="similarity_score_threshold">
                                    Similarity Threshold
                                </option>
                            </Select>
                        </Field>
                        <Field className={"border px-2 rounded-md p-3"}>
                            <label className="font-semibold">Documents</label>
                            <p className="text-xs text-slate/50">
                                Number of documents to retrieve for context.
                            </p>
                            <input
                                type="number"
                                name="k"
                                min="1"
                                max="100"
                                className="p-1 border rounded-md w-full mt-1"
                                value={
                                    initChatPayload.retrieval.search_kwargs.k
                                }
                                onChange={(e) =>
                                    setInitChatPayload((prev: ChatPayload) => ({
                                        ...prev,
                                        retrieval: {
                                            ...prev.retrieval,
                                            search_kwargs: {
                                                ...prev.retrieval.search_kwargs,
                                                k: e.target.value,
                                            },
                                        },
                                    }))
                                }
                            />
                        </Field>
                    </Fieldset>
                    <Fieldset className={"columns-2 mt-4"}>
                        <Field className={"border px-2 rounded-md p-3"}>
                            <label className="font-semibold">
                                Nearest &#40;fetch_k&#41;
                            </label>
                            <p className="text-xs text-slate/50">
                                Nearest neighbor documents to retrieve.
                            </p>
                            <input
                                type="number"
                                name="fetch_k"
                                min={1}
                                max={100}
                                className="p-1 border rounded-md w-full mt-1"
                                placeholder="Enter a number"
                                value={
                                    initChatPayload.retrieval.search_kwargs
                                        .fetch_k
                                }
                                onChange={(e) =>
                                    setInitChatPayload((prev: ChatPayload) => ({
                                        ...prev,
                                        retrieval: {
                                            ...prev.retrieval,
                                            search_kwargs: {
                                                ...prev.retrieval.search_kwargs,
                                                fetch_k: e.target.value,
                                            },
                                        },
                                    }))
                                }
                            />
                        </Field>
                        <Field className={"border px-2 rounded-md p-3"}>
                            <label className="font-semibold">Threshold</label>
                            <p className="text-xs text-slate/50">
                                Minimum score threshold for retrieval.
                            </p>
                            <input
                                type="number"
                                min="0.0"
                                max="1.0"
                                name="score_threshold"
                                className="p-1 border rounded-md w-full mt-1"
                                placeholder="0.5"
                                value={
                                    initChatPayload.retrieval.search_kwargs
                                        .score_threshold
                                }
                                onChange={(e) =>
                                    setInitChatPayload((prev: ChatPayload) => ({
                                        ...prev,
                                        retrieval: {
                                            ...prev.retrieval,
                                            search_kwargs: {
                                                ...prev.retrieval.search_kwargs,
                                                score_threshold: e.target.value,
                                            },
                                        },
                                    }))
                                }
                            />
                        </Field>
                    </Fieldset>
                </DisclosurePanel>
            </Disclosure>
        </>
    );
};

export default RetrievalForm;
