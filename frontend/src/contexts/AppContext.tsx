"use client";
import { useContext, createContext } from "react";
import { IContextProvider } from "../interfaces/provider";
import { useAppState } from "@/hooks/state/useAppState";
import { useHandleOutsideClickEffect } from "@/hooks/effect/useAppEffects";


export const AppContext = createContext({});

export default function AppProvider({ children }: IContextProvider) {
    const appState = useAppState();

    useHandleOutsideClickEffect(appState.isDrawerOpen, appState.closeDrawer);

    return (
        <AppContext.Provider
            value={appState}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext(): any {
    return useContext(AppContext);
}
