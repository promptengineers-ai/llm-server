import { useState, useEffect } from 'react';
import { API_URL } from "@/config/app";

export const useVersion = () => {
    const [version, setVersion] = useState<string>("");

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const response = await fetch(`${API_URL}/status`);
                const data = await response.json();
                setVersion(data.version || "");
            } catch (error) {
                console.error("Failed to fetch version:", error);
            }
        };
        
        fetchVersion();
    }, []);

    return version;
}; 