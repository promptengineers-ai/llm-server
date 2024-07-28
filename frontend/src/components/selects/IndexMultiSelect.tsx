import Select, { MultiValue, ActionMeta, components } from "react-select";
import { SearchProvider } from "@/types/llm";
import { useChatContext } from "@/contexts/ChatContext";
import { useEffect, useState } from "react";

type OptionType = {
    value: SearchProvider;
    label: string;
};

const CustomOption = (props: any) => {
    const { data, innerRef, innerProps } = props;
    const { deleteIndex, initChatPayload } = useChatContext();

    const handleDeleteClick = async (event: React.MouseEvent) => {
        event.stopPropagation();
        // Replace this with your API call for deleting
        const confirmDelete = confirm(
            `Are you sure you want to delete [${data.value}] index?`
        );
        if (!confirmDelete) {
            return; // If user clicks 'Cancel', exit the function
        }
        await deleteIndex(initChatPayload.retrieval.provider, data.value);
    };

    const handleUpdateClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        // Replace this with your API call for updating
        alert(`Update ${data.value}`);
    };

    return (
        <components.Option {...props}>
            <div className="flex items-center justify-between">
                <span>{data.label}</span>
                <div className="flex items-center">
                    <button
                        onClick={handleUpdateClick}
                        // className="text-blue-500 hover:text-blue-700 ml-2"
                    >
                        ✎
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="ml-2"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </components.Option>
    );
};

const IndexMultiSelect = () => {
    const { indexes, setInitChatPayload, initChatPayload } = useChatContext();
    const [options, setOptions] = useState<OptionType[]>([]);

    const formattedIndexes = indexes.map((index: any) => ({
        value: index.name,
        label: index.name,
    }));
    const selectedIndexes = initChatPayload.retrieval.indexes?.map(
        (index: any) => ({
            value: index,
            label: index,
        })
    );

    const handleChange = (
        newValue: MultiValue<OptionType>,
        actionMeta: ActionMeta<OptionType>
    ) => {
        setInitChatPayload((prev: any) => ({
            ...prev,
            retrieval: {
                ...prev.retrieval,
                indexes: newValue.map((option) => option.value),
            },
        }));
    };

    useEffect(() => {
        setOptions(formattedIndexes);
    }, [indexes])

    return (
        <div className="border px-2 rounded-md p-3">
            <label className="font-semibold">Indexes</label>
            <p className="text-xs text-slate-500">
                Select indexes to retrieve documents from.
            </p>
            <Select
                isMulti
                name="indexes"
                closeMenuOnSelect={false}
                options={options}
                className="basic-multi-select mt-1"
                classNamePrefix="select"
                value={selectedIndexes}
                onChange={handleChange}
                components={{ Option: CustomOption }}
            />
        </div>
    );
};

export default IndexMultiSelect;
