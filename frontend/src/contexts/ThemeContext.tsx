"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { IContextProvider } from "../interfaces/provider";

const DEFAULT_COLOR_MODE = "light";

const themeState = {
    theme: DEFAULT_COLOR_MODE,
    setTheme: (theme: string) => {},
};

const ThemeContext = createContext(themeState);

export const ThemeProvider = ({ children }: IContextProvider) => {
    const [theme, setTheme] = useState(() => {
        // Retrieve the stored theme or determine it based on system preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    // This effect runs once on mount and whenever the theme changes
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty(
            "--foreground-rgb",
            theme === "dark" ? "255, 255, 255" : "0, 0, 0"
        );
        root.style.setProperty(
            "--background-start-rgb",
            theme === "dark" ? "0, 0, 0" : "214, 219, 220"
        );
        root.style.setProperty(
            "--background-end-rgb",
            theme === "dark" ? "0, 0, 0" : "255, 255, 255"
        );
        root.className = theme; // This applies the theme class to the root element
        localStorage.setItem("theme", theme); // Persist the theme in localStorage
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
