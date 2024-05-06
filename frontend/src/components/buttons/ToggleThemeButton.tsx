"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ToggleThemeButton = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <button
            onClick={toggleTheme}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
            {theme === "light" ? <FaMoon fontSize={'20px'} /> : <FaSun fontSize={'20px'} />}
        </button>
    );
};

export default ToggleThemeButton;
