import { useAssignToolkitEffect } from "@/hooks/effect/useToolEffects";
import React, { useEffect, useState } from "react";

interface Option {
    id: number;
    name: string;
}

interface SearchableInputProps {
    options?: Option[];
    value?: string
}

const defaultOptions: Option[] = [
    { id: 1, name: "Option One" },
    { id: 2, name: "Option Two" },
    { id: 3, name: "Option Three" },
    // Add more options here
];

const SearchableInput: React.FC<SearchableInputProps> = ({
    options = defaultOptions,
    value = "",
}) => {
    const [query, setQuery] = useState('');
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [isFocused, setIsFocused] = useState(false); // Track input focus state

    const filteredOptions = options.filter((option) =>
        option.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        setQuery(option.name);
        setIsFocused(false); // Hide dropdown after selection
    };

    useAssignToolkitEffect(query);
    useEffect(() => {
        if (value) {
            const selected = options.find((option) => option.name === value);
            if (selected) {
                setSelectedOption(selected);
                setQuery(selected.name);
            }
        }
    }, [value]);

    return (
        <div className="relative">
            <input
                type="text"
                className="px-2 py-1 border rounded-md w-full mt-1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type or select an option"
                onFocus={() => setIsFocused(true)} // Show dropdown on focus
                onBlur={() => setIsFocused(false)} // Hide dropdown on blur
            />
            {isFocused && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {filteredOptions.map((option) => (
                        <li
                            key={option.id}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9"
                            onMouseDown={() => handleSelect(option)} // Prevent blur before selection
                        >
                            <span
                                className={`block truncate ${
                                    selectedOption?.id === option.id
                                        ? "font-semibold"
                                        : "font-normal"
                                }`}
                            >
                                {option.name}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchableInput;
