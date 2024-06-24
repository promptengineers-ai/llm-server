import { Field, Fieldset } from "@headlessui/react";

const GitbookLoaderForm = () => {
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
                    // value={initChatPayload.system}
                    // onChange={(e) => {
                    //     setInitChatPayload((prev: ChatPayload) => ({
                    //         ...prev,
                    //         system: e.target.value,
                    //     }));
                    //     sessionStorage.setItem("system", e.target.value);
                    // }}
                />
            </Field>
        </Fieldset>
    );
};

export default GitbookLoaderForm;
