import { useChatContext } from "@/contexts/ChatContext";
import { Field, Fieldset } from "@headlessui/react";
import { useState } from "react";

const GitbookLoaderForm = () => {
    const { setLoaders, loaders } = useChatContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setLoaders((prev: any) => {
            const existingLoaderIndex = prev.findIndex(
                (l: any) => l.type === "gitbook"
            );

            if (existingLoaderIndex > -1) {
                // Update existing loader
                const updatedLoaders = [...prev];
                updatedLoaders[existingLoaderIndex] = {
                    ...updatedLoaders[existingLoaderIndex],
                    urls: [url],
                };
                return updatedLoaders;
            } else {
                // Add new loader
                return [...prev, { type: "gitbook", urls: [url] }];
            }
        });
    };

    const gitbookUrl =
        loaders.find((l: any) => l.type === "gitbook")?.urls[0] || "";

    return (
        <Fieldset>
            <Field className={"border rounded-md p-2"}>
                <label className="font-semibold">Gitbook</label>
                <p className="mt-1 mb-2 text-xs">
                    Gitbook loader for web documents.
                </p>
                <input
                    type="url"
                    className="px-2 py-1 border rounded-md w-full mt-1"
                    placeholder="Enter gitbook url"
                    onChange={handleChange}
                    value={gitbookUrl}
                />
            </Field>
        </Fieldset>
    );
};

export default GitbookLoaderForm;
