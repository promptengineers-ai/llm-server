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
    // Use a state initialized to light mode by default
    const [theme, setTheme] = useState(DEFAULT_COLOR_MODE);

    // Effect to check the system theme or stored theme, but only run this on the client side
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || DEFAULT_COLOR_MODE;
        setTheme(savedTheme);
        localStorage.setItem("theme", savedTheme);
    }, []);
    // useEffect(() => {
    //     const savedTheme =
    //         localStorage.getItem("theme") ||
    //         (window.matchMedia("(prefers-color-scheme: dark)").matches
    //             ? "dark"
    //             : "light");
    //     setTheme(savedTheme);
    //     localStorage.setItem("theme", savedTheme);
    // }, []);

    // Apply the theme to the root element
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
        root.className = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
