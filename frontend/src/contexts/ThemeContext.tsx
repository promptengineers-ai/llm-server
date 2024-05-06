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
    const [theme, setTheme] = useState(DEFAULT_COLOR_MODE);

    useEffect(() => {
        // Access localStorage only on the client side, after mounting
        const storedTheme = localStorage.getItem("theme");
        setTheme(storedTheme || DEFAULT_COLOR_MODE);
    }, []);

    // Check local storage for theme
    useEffect(() => {
        const root = document.documentElement;
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            const defaultTheme =
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
            setTheme(defaultTheme); // Set theme based on system preference initially
            localStorage.setItem("theme", defaultTheme);
        }
    }, []);

    // Update the theme in local storage
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.style.setProperty("--foreground-rgb", "255, 255, 255");
            root.style.setProperty("--background-start-rgb", "0, 0, 0");
            root.style.setProperty("--background-end-rgb", "0, 0, 0");
        } else {
            root.style.setProperty("--foreground-rgb", "0, 0, 0");
            root.style.setProperty("--background-start-rgb", "214, 219, 220");
            root.style.setProperty("--background-end-rgb", "255, 255, 255");
        }
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
