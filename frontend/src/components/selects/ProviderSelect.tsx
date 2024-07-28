import { ON_PREM } from "@/config/app";
import { useChatContext } from "@/contexts/ChatContext";
import { SearchProvider } from "@/types/llm";
import { capitalizeFirstLetter } from "@/utils/chat";
import { Field } from "@headlessui/react";
import React from "react";
import Select, { SingleValue } from "react-select";

type ChatPayload = {
    retrieval: {
        provider: string;
    };
};

type ProviderSelectProps = {
    initChatPayload: ChatPayload;
    setInitChatPayload: React.Dispatch<React.SetStateAction<ChatPayload>>;
};

const options = [
    { value: SearchProvider.POSTGRES, label: capitalizeFirstLetter(SearchProvider.POSTGRES) },
    { value: SearchProvider.REDIS, label: capitalizeFirstLetter(SearchProvider.REDIS) },
];

if (!ON_PREM) {
    options.push({ value: SearchProvider.PINECONE, label: capitalizeFirstLetter(SearchProvider.PINECONE) });
    // options.push({ value: "MONGO", label: "Mongo", isDisabled: true });
}

const ProviderSelect: React.FC = () => {
    const { initChatPayload, setInitChatPayload } = useChatContext();

    const handleChange = (
        selectedOption: SingleValue<{ value: string; label: string }>
    ) => {
        if (selectedOption) {
            setInitChatPayload((prev: ChatPayload) => ({
                ...prev,
                retrieval: {
                    ...prev.retrieval,
                    provider: selectedOption.value,
                },
            }));
            sessionStorage.setItem("provider", selectedOption.value);
        }
    };

    return (
        <Field className={"border px-2 rounded-md p-3 mt-2"}>
            <label className="font-semibold">Provider</label>
            <p className="text-xs text-slate-500">
                Choose the provider for the retrieval process.
            </p>
            <Select
                name="provider"
                aria-label="Provider"
                classNamePrefix="react-select"
                className="mt-1"
                options={options}
                onChange={handleChange}
                value={options.find(
                    (option) =>
                        option.value === initChatPayload.retrieval.provider
                )}
            />
        </Field>
    );
};

export default ProviderSelect;
