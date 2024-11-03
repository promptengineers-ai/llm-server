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
        embedding: string;
    };
};

// type ProviderSelectProps = {
//     initChatPayload: ChatPayload;
//     setInitChatPayload: React.Dispatch<React.SetStateAction<ChatPayload>>;
// };

type LLM = {
    model_name: string;
    embedding: boolean;
};

const providerOptions = [
    {
        value: SearchProvider.POSTGRES,
        label: capitalizeFirstLetter(SearchProvider.POSTGRES),
    },
    {
        value: SearchProvider.REDIS,
        label: capitalizeFirstLetter(SearchProvider.REDIS),
    },
];

if (!ON_PREM) {
    providerOptions.push({
        value: SearchProvider.PINECONE,
        label: capitalizeFirstLetter(SearchProvider.PINECONE),
    });
}

const EmbeddingSelect: React.FC = () => {
    const { initChatPayload, setInitChatPayload, models } = useChatContext();

    // const handleProviderChange = (
    //     selectedOption: SingleValue<{ value: string; label: string }>
    // ) => {
    //     if (selectedOption) {
    //         setInitChatPayload((prev: ChatPayload) => ({
    //             ...prev,
    //             retrieval: {
    //                 ...prev.retrieval,
    //                 provider: selectedOption.value,
    //             },
    //         }));
    //         sessionStorage.setItem("provider", selectedOption.value);
    //     }
    // };

    const handleEmbeddingChange = (
        selectedOption: SingleValue<{ value: string; label: string }>
    ) => {
        if (selectedOption) {
            setInitChatPayload((prev: ChatPayload) => ({
                ...prev,
                retrieval: {
                    ...prev.retrieval,
                    embedding: selectedOption.value,
                },
            }));
            sessionStorage.setItem("embedding", selectedOption.value);
        }
    };

    const embeddingOptions = models
        .filter((model: LLM) => model.embedding)
        .map((embedding: LLM) => ({
            value: embedding.model_name,
            label: embedding.model_name,
        }));

    return (
        <Field className={"border px-2 rounded-md p-3 mt-4"}>
            <label className="font-semibold">Embedding</label>
            <p className="text-xs text-slate-500">
                Choose the embedding model for retrieval.
            </p>
            <Select
                name="embedding"
                aria-label="Embedding"
                classNamePrefix="react-select"
                className="mt-1"
                options={embeddingOptions}
                onChange={handleEmbeddingChange}
                value={embeddingOptions.find(
                    (option: any) =>
                        option.value === initChatPayload.retrieval.embedding
                )}
            />
        </Field>
    );
};

export default EmbeddingSelect;
