"use client";
import { createContext, useContext, useState } from "react";
import { IContextProvider } from "@/interfaces/provider";

interface AppContextType {
    isDrawerOpen: boolean;
    toggleDrawer: () => void;
    isPopoverOpen: boolean;
    setIsPopoverOpen: (value: boolean) => void;
    isWebLoaderOpen: boolean;
    setIsWebLoaderOpen: (value: boolean) => void;
    isCustomizeOpen: boolean;
    setIsCustomizeOpen: (value: boolean) => void;
    isMobile: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function AppProvider({ children }: IContextProvider) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isWebLoaderOpen, setIsWebLoaderOpen] = useState(false);
    const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const isMobile = () => {
        return window.innerWidth <= 768;
    };

    const value = {
        isDrawerOpen,
        toggleDrawer,
        isPopoverOpen,
        setIsPopoverOpen,
        isWebLoaderOpen,
        setIsWebLoaderOpen,
        isCustomizeOpen,
        setIsCustomizeOpen,
        isMobile,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}
