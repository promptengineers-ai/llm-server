import { useChatContext } from "@/contexts/ChatContext";
import { ChatPayload } from "@/types/chat";
import {
    Field,
    Fieldset,
    Select,
    Label,
    Description,
} from "@headlessui/react";

const RetrievalForm = () => {
    const {chatPayload, setChatPayload} = useChatContext();
    return (
        <Fieldset className={"columns-2"}>
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
                        setChatPayload((prev: ChatPayload) => ({
                            ...prev,
                            retrieval: {
                                ...prev.retrieval,
                                provider: e.target.value,
                            },
                        }))
                    }
                    value={chatPayload.retrieval.provider}
                >
                    <option value="redis">Redis</option>
                    <option value="pinecone">Pinecone</option>
                    <option value="mongo" disabled className="bg-gray-200">
                        Mongo
                    </option>
                </Select>
            </Field>
            <Field className={"border px-2 rounded-md p-3"}>
                <label className="font-semibold">Search Type</label>
                <p className="text-xs text-slate/50">
                    Vector search algorithm to retrieve docs.
                </p>
                <Select
                    name="provider"
                    aria-label="Provider"
                    className="p-1 border rounded-md w-full mt-1"
                    onChange={(e) =>
                        setChatPayload((prev: ChatPayload) => ({
                            ...prev,
                            retrieval: {
                                ...prev.retrieval,
                                search_type: e.target.value,
                            },
                        }))
                    }
                    value={chatPayload.retrieval.search_type}
                >
                    <option value="similarity">Similarity</option>
                    <option value="mmr">MMR</option>
                    <option value="mongo" disabled className="bg-gray-200">
                        Similarity Score Threshold
                    </option>
                </Select>
            </Field>
        </Fieldset>
    );
};

export default RetrievalForm;
