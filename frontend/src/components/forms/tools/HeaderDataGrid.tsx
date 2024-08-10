import { useToolContext } from "@/contexts/ToolContext";
import { useAssignHeadersEffect } from "@/hooks/effect/useToolEffects";
import { Field, Fieldset, Button } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function HeaderDataGrid() {
    const {tool} = useToolContext();
    const [rows, setRows] = useState([
        { id: 1, key: "", value: "", encrypted: false },
    ]);

    const addRow = (index: number) => {
        const newRow = {
            id: rows.length + 1,
            key: "",
            value: "",
            encrypted: false,
        };
        const newRows = [...rows];
        newRows.splice(index + 1, 0, newRow);
        setRows(newRows);
    };

    const removeRow = (index: number) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const toggleLock = (index: number) => {
        setRows((prevRows) =>
            prevRows.map((row, i) =>
                i === index ? { ...row, encrypted: !row.encrypted } : row
            )
        );
    };

    useAssignHeadersEffect(rows);

    useEffect(() => {
        const headers = tool.headers;
        const keys = Object.keys(headers);
        const result = keys.map((key, index) => {
            return {
                id: index + 1,
                key: key,
                value: headers[key].value,
                encrypted: headers[key].encrypted,
            };
        });
        if (keys.length > 0) {
            setRows(result);
        }
    }, []);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="border p-2">Key</th>
                        <th className="border p-2">Value</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.id} className="border-b">
                            <td className="border p-2">
                                <Fieldset>
                                    <Field>
                                        <input
                                            type="text"
                                            className="px-2 py-1 border rounded-md w-full"
                                            value={row.key}
                                            onChange={(e) =>
                                                setRows((prevRows) =>
                                                    prevRows.map((r, i) =>
                                                        i === index
                                                            ? {
                                                                  ...r,
                                                                  key: e.target
                                                                      .value,
                                                              }
                                                            : r
                                                    )
                                                )
                                            }
                                            disabled={row.encrypted}
                                        />
                                    </Field>
                                </Fieldset>
                            </td>
                            <td className="border p-2">
                                <Fieldset>
                                    <Field>
                                        <input
                                            type={
                                                row.encrypted
                                                    ? "password"
                                                    : "text"
                                            } // Change type based on encrypted state
                                            className="px-2 py-1 border rounded-md w-full"
                                            value={row.value}
                                            onChange={(e) =>
                                                setRows((prevRows) =>
                                                    prevRows.map((r, i) =>
                                                        i === index
                                                            ? {
                                                                  ...r,
                                                                  value: e
                                                                      .target
                                                                      .value,
                                                              }
                                                            : r
                                                    )
                                                )
                                            }
                                        />
                                    </Field>
                                </Fieldset>
                            </td>
                            <td className="border p-2 flex justify-center space-x-2">
                                <Button
                                    className={`p-1 border rounded-md ${
                                        row.encrypted ? "bg-gray-300" : ""
                                    }`}
                                    onClick={() => toggleLock(index)}
                                >
                                    🔒
                                </Button>
                                {index === rows.length - 1 ? (
                                    <Button
                                        className="p-1 border rounded-md"
                                        onClick={() => addRow(index)}
                                    >
                                        ➕
                                    </Button>
                                ) : (
                                    <Button
                                        className="p-1 border rounded-md"
                                        onClick={() => removeRow(index)}
                                    >
                                        ➖
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
