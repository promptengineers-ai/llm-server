import { useChatContext } from "@/contexts/ChatContext";
import { Field, Fieldset } from "@headlessui/react";

const TextLoaderForm = () => {
    const { loaders, setLoaders } = useChatContext();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setLoaders((prev: any) => {
            const existingLoaderIndex = prev.findIndex(
                (l: any) => l.type === "copy"
            );

            if (existingLoaderIndex > -1) {
                // Update existing loader
                const updatedLoaders = [...prev];
                updatedLoaders[existingLoaderIndex] = {
                    ...updatedLoaders[existingLoaderIndex],
                    text: text,
                };
                return updatedLoaders;
            } else {
                // Add new loader
                return [...prev, { type: "copy", text: text }];
            }
        });
    };

    const textValue = loaders.find((l: any) => l.type === "copy")?.text || "";

    return (
        <Fieldset>
            <Field className={"border rounded-md p-2"}>
                <label className="font-semibold">Text</label>
                <p className="mt-1 mb-2 text-xs">
                    Text loader for web documents.
                </p>
                <textarea
                    className="w-full resize-y rounded p-2 placeholder:text-gray-300 border text-sm"
                    rows={6}
                    onChange={handleChange}
                    value={textValue}
                />
            </Field>
        </Fieldset>
    );
};

export default TextLoaderForm;
