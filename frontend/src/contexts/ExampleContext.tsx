import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { IContextProvider } from "../interfaces/provider";

export const ExampleContext = createContext({});

export default function ExampleProvider({ children }: IContextProvider) {
    // Suppose you have some state or derived data here
    const [state, setState] = useState(); // Example state

    return (
        <ExampleContext.Provider
            value={useMemo(() => {
                // Your context value that depends on state, props, etc.
                return {
                    // Include state or methods that consumers of this context would need
                    state,
                    // Example method that alters the state
                    updateState: (newState: any) => setState(newState),
                };
            }, [state])}
        >
            {children}
        </ExampleContext.Provider>
    );
}

export function useExampleContext(): any {
    return useContext(ExampleContext);
}
