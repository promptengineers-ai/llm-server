"use client";
import { useContext, createContext } from "react";
import { IContextProvider } from "../interfaces/provider";
import { useAppState } from "@/hooks/state/useAppState";
import { useHandleOutsideClickEffect } from "@/hooks/effect/useAppEffects";


export const AppContext = createContext({});

export default function AppProvider({ children }: IContextProvider) {
    const {
        loading,
        setLoading,
        isOpen,
        setIsOpen,
        isDrawerOpen,
        setIsDrawerOpen,
        isPopoverOpen,
        setIsPopoverOpen,
        isWebLoaderOpen,
        setIsWebLoaderOpen,
        isMobile,
        toggleDrawer,
        closeDrawer,
    } = useAppState();

    useHandleOutsideClickEffect(isDrawerOpen, closeDrawer);

    return (
        <AppContext.Provider
            value={{
                loading,
                setLoading,
                isOpen,
                setIsOpen,
                isDrawerOpen,
                setIsDrawerOpen,
                isPopoverOpen,
                setIsPopoverOpen,
                isWebLoaderOpen,
                setIsWebLoaderOpen,
                isMobile,
                toggleDrawer,
                closeDrawer,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext(): any {
    return useContext(AppContext);
}
