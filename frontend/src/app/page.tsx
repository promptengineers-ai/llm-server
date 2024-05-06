'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ToggleThemeButton from "@/components/buttons/ToggleThemeButton";
import LoginForm from "@/components/forms/LoginForm";

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
            {/* <div style={{ position: "absolute", top: 20, right: 20 }}>
                <ToggleThemeButton />
            </div> */}
            <LoginForm />
        </main>
    );
}
