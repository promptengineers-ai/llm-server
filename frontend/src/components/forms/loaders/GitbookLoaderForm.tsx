import {
    Field,
    Fieldset,
} from "@headlessui/react";

const GitbookLoaderForm = () => {
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
                />
            </Field>
        </Fieldset>
    );
};

export default GitbookLoaderForm;
