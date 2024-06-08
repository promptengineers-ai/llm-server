"use client";
import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { IContextProvider } from "../interfaces/provider";

export const AppContext = createContext({});

export default function AppProvider({ children }: IContextProvider) {
    // Suppose you have some state or derived data here
    const [loading, setLoading] = useState(false); // App state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const isMobile = () => {
        const isClient = typeof window === "object";

        // Function to check window size and return isOpen state
        const getSize = () => {
            return window.innerWidth < 768;
        };

        return isClient ? getSize() : false;
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            const drawer = document.getElementById("drawer");
            if (drawer && !drawer.contains(event.target)) {
                closeDrawer();
            }
        };

        if (isDrawerOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isDrawerOpen]);

    return (
        <AppContext.Provider
            value={useMemo(() => {
                // Your context value that depends on state, props, etc.
                return {
                    // Include state or methods that consumers of this context would need
                    loading,
                    isDrawerOpen,
                    isOpen,
                    isPopoverOpen,
                    // App method that alters the state
                    setLoading,
                    isMobile,
                    setIsDrawerOpen,
                    toggleDrawer,
                    closeDrawer,
                    setIsOpen,
                    setIsPopoverOpen,
                };
            }, [
                loading,
                isDrawerOpen,
                isOpen,
                isPopoverOpen,
            ])}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext(): any {
    return useContext(AppContext);
}
