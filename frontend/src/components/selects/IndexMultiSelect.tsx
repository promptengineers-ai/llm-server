import Select, { MultiValue, ActionMeta, components } from "react-select";
import { SearchProvider } from "@/types/llm";
import { useChatContext } from "@/contexts/ChatContext";

type OptionType = {
    value: SearchProvider;
    label: string;
};

const CustomOption = (props: any) => {
    const { data, innerRef, innerProps } = props;

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        // Replace this with your API call for deleting
        alert(`Delete ${data.value}`);
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
                        // className="text-red-500 hover:text-red-700 ml-2"
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

    const formattedIndexes = indexes.map((index: any) => ({
        value: index.name,
        label: index.name,
    }));
    const selectedIndexes = initChatPayload.retrieval.indexes.map(
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
                options={formattedIndexes}
                className="basic-multi-select mt-1"
                classNamePrefix="select"
                value={selectedIndexes}
                onChange={handleChange}
                // components={{ Option: CustomOption }}
            />
        </div>
    );
};

export default IndexMultiSelect;
