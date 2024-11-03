// https://chatgpt.com/share/9da3c401-7e86-4ad9-a635-2729a0d015d5
import { useState } from "react";

const initialState = {};

export const useExampleState = () => {
    const [state, setState] = useState(initialState);

    const updateState = (newState: any) => {
        setState(newState);
    };

    return {
        state,
        updateState,
    };
};
