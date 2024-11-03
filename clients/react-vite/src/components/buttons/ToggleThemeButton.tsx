import { useThemeContext } from "@/contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ToggleThemeButton = () => {
    const { theme } = useThemeContext();

    return (
        <button
            // onClick={toggleTheme}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
            {theme === "light" ? <FaMoon fontSize={'20px'} /> : <FaSun fontSize={'20px'} />}
        </button>
    );
};

export default ToggleThemeButton;
