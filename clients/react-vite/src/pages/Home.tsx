import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/forms/LoginForm";
import { FaGithub } from "react-icons/fa";

export default function Home() {
    const navigate = useNavigate();

    // Check for token in localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Redirect to /chat if token exists
            navigate("/chat");
        }
    }, [navigate]);

    return (
        <main
            className="flex min-h-screen flex-col"
            style={{ position: "relative" }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    cursor: "pointer",
                }}
            >
                <a href="https://github.com/promptengineers-ai/llm-server" target="_blank">
                    <FaGithub fontSize={"2rem"} />
                </a>
            </div>
            <LoginForm />
        </main>
    );
} 