import { Field, Fieldset } from "@headlessui/react";
import { useToolContext } from "@/contexts/ToolContext";
import SearchableInput from "@/components/selects/SearchableInput";

export default function ToolDetailsForm() {
    const { tool, updateToolState, fetchToolkits } = useToolContext();

    return (
        <div className="overflow-y-auto max-h-[85dvh]">
            <Fieldset className={"mb-2"}>
                <Field className={"border rounded-md p-2"}>
                    <label className="font-semibold">Name</label>
                    <p className="mt-1 mb-1 text-xs">
                        The name of the tool to be used
                    </p>
                    <input
                        required
                        type="text"
                        className="px-2 py-1 border rounded-md w-full mt-1"
                        placeholder="Enter tool name"
                        onChange={(e) =>
                            updateToolState({ name: e.target.value })
                        }
                        value={tool.name}
                    />
                </Field>
            </Fieldset>
            <Fieldset className={"mb-2"}>
                <Field className={"border rounded-md p-2"}>
                    <label className="font-semibold">Toolkit</label>
                    <p className="text-xs text-slate/50">
                        The toolkit to be used for the tool
                    </p>
                    <SearchableInput
                        options={fetchToolkits()}
                        value={tool.toolkit}
                    />
                </Field>
            </Fieldset>
            <Fieldset className={"mb-2"}>
                <Field className={"border rounded-md p-2"}>
                    <label className="font-semibold">Description</label>
                    <p className="text-xs text-slate/50 mb-1">
                        The HTTP method to use for the request
                    </p>
                    <textarea
                        required
                        className="w-full resize-y rounded-sm p-2 placeholder:text-gray-300 border text-sm"
                        rows={2}
                        placeholder="Enter tool description"
                        onChange={(e) =>
                            updateToolState({ description: e.target.value })
                        }
                        value={tool.description}
                    />
                </Field>
            </Fieldset>
            <Fieldset className={"mb-2"}>
                <Field className={"border rounded-md p-2"}>
                    <label className="font-semibold">Documentation</label>
                    <p className="mt-1 mb-1 text-xs">
                        The documentation for the tool
                    </p>
                    <input
                        type="text"
                        className="px-2 py-1 border rounded-md w-full mt-1"
                        placeholder="Enter documentation link"
                        onChange={(e) =>
                            updateToolState({ link: e.target.value })
                        }
                        value={tool.link}
                    />
                </Field>
            </Fieldset>
        </div>
    );
}
