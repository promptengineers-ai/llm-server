import { useEffect, useState } from "react";
import { Field, Fieldset, Button } from "@headlessui/react";
import { useToolContext } from "@/contexts/ToolContext";
import { useAssignArgsEffect } from "@/hooks/effect/useToolEffects";

export default function ArgsDataGrid() {
    const { tool } = useToolContext();
    const [rows, setRows] = useState([
        {
            id: 1,
            key: "",
            type: "str",
            description: "",
            required: false,
            default: "",
        },
    ]);

    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            key: "",
            type: "str",
            description: "",
            required: false,
            default: "",
        };
        setRows([...rows, newRow]);
    };

    const removeRow = (index: number) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const toggleRequired = (index: number) => {
        setRows((prevRows) =>
            prevRows.map((row, i) =>
                i === index ? { ...row, required: !row.required } : row
            )
        );
    };

    useAssignArgsEffect(rows);

    useEffect(() => {
        const args = tool.args;
        const keys = Object.keys(args);
        const result = keys.map((key, index) => {
            return {
                id: index + 1,
                key: key,
                description: args[key].description,
                type: args[key].type,
                default: args[key].default,
                required: args[key].required,
            };
        });
        if (keys.length > 0) {
            setRows(result);
        }
    }, []);

    return (
        <div className="space-y-4">
            {rows.map((row, index) => (
                <div
                    key={row.id}
                    className="p-4 border rounded-md bg-white space-y-4"
                >
                    <Fieldset className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            <Field className="col-span-1">
                                <label className="block font-medium">
                                    Type
                                </label>
                                <select
                                    className="px-2 py-1 border rounded-md w-full mt-1"
                                    value={row.type}
                                    onChange={(e) =>
                                        setRows((prevRows) =>
                                            prevRows.map((r, i) =>
                                                i === index
                                                    ? {
                                                          ...r,
                                                          type: e.target.value,
                                                      }
                                                    : r
                                            )
                                        )
                                    }
                                >
                                    <option value="str">str</option>
                                    <option value="int">int</option>
                                    <option value="bool">bool</option>
                                    <option value="float">float</option>
                                </select>
                            </Field>
                            <Field className="col-span-2">
                                <label className="block font-medium">Key</label>
                                <input
                                    type="text"
                                    className="px-2 py-1 border rounded-md w-full mt-1"
                                    value={row.key}
                                    onChange={(e) =>
                                        setRows((prevRows) =>
                                            prevRows.map((r, i) =>
                                                i === index
                                                    ? {
                                                          ...r,
                                                          key: e.target.value,
                                                      }
                                                    : r
                                            )
                                        )
                                    }
                                />
                            </Field>
                            {/* <Field className="col-span-2">
                                <label className="block font-medium">
                                    Default
                                </label>
                                <input
                                    type="text"
                                    className="px-2 py-1 border rounded-md w-full mt-1"
                                    value={row.default}
                                    onChange={(e) =>
                                        setRows((prevRows) =>
                                            prevRows.map((r, i) =>
                                                i === index
                                                    ? {
                                                          ...r,
                                                          default:
                                                              e.target.value,
                                                      }
                                                    : r
                                            )
                                        )
                                    }
                                />
                            </Field> */}
                        </div>
                        <Field>
                            <label className="block font-medium">
                                Description
                            </label>
                            <textarea
                                className="px-2 py-1 border rounded-md w-full mt-1"
                                value={row.description}
                                rows={3}
                                onChange={(e) =>
                                    setRows((prevRows) =>
                                        prevRows.map((r, i) =>
                                            i === index
                                                ? {
                                                      ...r,
                                                      description:
                                                          e.target.value,
                                                  }
                                                : r
                                        )
                                    )
                                }
                            />
                        </Field>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="font-medium">Required</span>
                                <span
                                    className={`ml-2 ${
                                        row.required
                                            ? "bg-purple-600"
                                            : "bg-gray-200"
                                    } relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer`}
                                    onClick={() => toggleRequired(index)}
                                >
                                    <span
                                        className={`${
                                            row.required
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                    />
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    className="p-1 border rounded-md"
                                    onClick={() => removeRow(index)}
                                    disabled={rows.length === 1}
                                >
                                    ➖ Remove
                                </Button>
                                {index === rows.length - 1 && (
                                    <Button
                                        className="p-1 border rounded-md"
                                        onClick={addRow}
                                    >
                                        ➕ Add
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Fieldset>
                </div>
            ))}
        </div>
    );
}
