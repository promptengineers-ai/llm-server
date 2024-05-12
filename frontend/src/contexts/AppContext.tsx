"use client";
import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { IContextProvider } from "../interfaces/provider";

export const AppContext = createContext({});

export default function AppProvider({ children }: IContextProvider) {
    // Suppose you have some state or derived data here
    const [loading, setLoading] = useState(false); // App state

    const isMobile = () => {
        const isClient = typeof window === "object";

        // Function to check window size and return isOpen state
        const getSize = () => {
            return window.innerWidth < 768;
        };

        return isClient ? getSize() : false;
    };

    return (
        <AppContext.Provider
            value={useMemo(() => {
                // Your context value that depends on state, props, etc.
                return {
                    // Include state or methods that consumers of this context would need
                    loading,
                    // App method that alters the state
                    setLoading,
                    isMobile,
                };
            }, [loading])}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext(): any {
    return useContext(AppContext);
}
