import { useChatContext } from "@/contexts/ChatContext";
import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import { useState } from "react";


export function ToolkitComboBox() {
    const {tools} = useChatContext();
    
    const kits = tools
        .map((tool: any) => ({
            id: tool.value,
            name: tool.toolkit,
        }))
        .filter(
            (value: any, index: number, self: any) =>
                index === self.findIndex((t: any) => t.id === value.id)
        );

    // Ensure the selectedPerson type is correct and can handle null
    const [selectedPerson, setSelectedPerson] = useState<{
        id: number;
        name: string;
    } | null>(kits[0]);
    const [query, setQuery] = useState("");

    // const filteredPeople =
    //     query === ""
    //         ? people
    //         : people.filter((person) => {
    //               return person.name
    //                   .toLowerCase()
    //                   .includes(query.toLowerCase());
    //           });


    return (
        <Combobox
            value={selectedPerson}
            onChange={(value) => setSelectedPerson(value)} // Explicitly typing this is unnecessary now
            onClose={() => setQuery("")}
        >
            <ComboboxInput
                aria-label="Assignee"
                displayValue={(person: { id: number; name: string } | null) =>
                    person?.name || ""
                }
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
            <ComboboxOptions anchor="bottom" className="border empty:invisible">
                {kits.map((kit: any) => (
                    <ComboboxOption
                        key={kit.id}
                        value={kit}
                        className="data-[focus]:bg-blue-100"
                    >
                        {kit.name}
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </Combobox>
    );
}
