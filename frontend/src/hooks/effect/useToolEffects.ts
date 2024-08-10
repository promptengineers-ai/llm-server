import { useToolContext } from "@/contexts/ToolContext";
import { useEffect } from "react";

export const useAssignHeadersEffect = (rows: any) => {
    const { updateToolState } = useToolContext();

    useEffect(() => {
        // Transform the rows into an object, only including rows with non-falsy key and value
        const transformedObject = rows.reduce(
            (
                acc: any,
                {
                    key,
                    value,
                    encrypted,
                }: { key: string; value: string; encrypted: boolean }
            ) => {
                if (key && value) {
                    // Ensure both key and value are non-falsy
                    acc[key] = { value, encrypted };
                }
                return acc;
            },
            {}
        );

        // Update the context state
        updateToolState({ headers: transformedObject });
    }, [rows]);
};

export const useAssignArgsEffect = (rows: any) => {
    const { updateToolState } = useToolContext();

    useEffect(() => {
        // Transform the rows into an object, only including rows with non-falsy key
        const transformedObject = rows.reduce(
            (
                acc: any,
                {
                    key,
                    description, // Add description
                    type, // Add type
                    default: defaultValue, // Add default
                    required, // Add required
                }: {
                    key: string;
                    description?: string; // Include description as optional
                    type: string; // Include type as optional
                    default?: any; // Include default as optional
                    required: boolean; // Include required as optional
                }
            ) => {
                if (key) {
                    // Ensure key is non-falsy
                    acc[key] = {
                        description, // Add description
                        type, // Add type
                        default: defaultValue, // Add default
                        required, // Add required
                    };
                }
                return acc;
            },
            {}
        );

        // Update the context state
        updateToolState({ args: transformedObject });
    }, [rows]); // Add updateToolState to the dependency array
};
