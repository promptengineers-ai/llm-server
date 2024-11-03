import { Field, Fieldset, Select } from "@headlessui/react";
import { useToolContext } from "@/contexts/ToolContext";

export default function ToolDetailsForm() {
    const { tool, updateToolState } = useToolContext();
    return (
        <div className="overflow-y-auto max-h-[85dvh]">
            <Fieldset className={"mb-2"}>
                <Field className={"border rounded-md p-2"}>
                    <label className="font-semibold">Method</label>
                    <p className="text-xs text-slate/50">
                        The HTTP method to use for the request
                    </p>
                    <Select
                        name="method"
                        aria-label="method"
                        className="p-1 border rounded-md w-full mt-1"
                        onChange={(e) =>
                            updateToolState({ method: e.target.value })
                        }
                        value={tool.method}
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </Select>
                </Field>
            </Fieldset>
            <Fieldset className={"mb-2"}>
                <Field className={"border rounded-md p-2"}>
                    <label className="font-semibold">URL</label>
                    <p className="mt-1 mb-1 text-xs">
                        The URL to be used for the request
                    </p>
                    <input
                        type="url"
                        className="px-2 py-1 border rounded-md w-full mt-1"
                        placeholder="Enter request URL"
                        onChange={(e) =>
                            updateToolState({ url: e.target.value })
                        }
                        value={tool.url}
                    />
                </Field>
            </Fieldset>
        </div>
    );
}
