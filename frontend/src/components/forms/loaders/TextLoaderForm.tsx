import { useChatContext } from "@/contexts/ChatContext";
import { Field, Fieldset } from "@headlessui/react";

const TextLoaderForm = () => {
    const {loaders, setLoaders} = useChatContext();

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
                    onChange={(e) =>
                        setLoaders((prev: any) => [
                            ...prev,
                            {
                                type: "copy",
                                text: e.target.value,
                            },
                        ])
                    }
                    value={loaders.find((l: any) => l.type === "copy")?.text}
                />
            </Field>
        </Fieldset>
    );
};

export default TextLoaderForm;
