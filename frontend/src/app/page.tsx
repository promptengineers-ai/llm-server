'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ToggleThemeButton from "@/components/buttons/ToggleThemeButton";
import LoginForm from "@/components/forms/LoginForm";
import { FaGithub } from "react-icons/fa";

export default function Home() {
    const router = useRouter();

    // Check for token in localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Redirect to /chat if token exists
            router.push("/chat");
        }
    }, [router]);

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
                {/* <ToggleThemeButton /> */}
                <a href="https://github.com/promptengineers-ai/llm-server" target="_blank">
                    <FaGithub fontSize={"2rem"} />
                </a>
            </div>
            <LoginForm />
        </main>
    );
}
