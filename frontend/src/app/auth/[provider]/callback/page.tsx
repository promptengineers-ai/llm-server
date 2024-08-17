"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";

const OAuthLogin = () => {
    const searchParams = useSearchParams();
    const params = useParams();
    const code = searchParams.get("code");
    const provider = params.provider as string; // Extract provider from dynamic route
    const { getOauthAccessToken } = useAuthContext();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (code && provider && !hasFetched.current) {
            getOauthAccessToken(provider, code);
            hasFetched.current = true;
        }
    }, [code, provider, getOauthAccessToken]);

    return (
        <main className="overflow-w-full h-svh relative flex z-0">
            <div>
                <p>Code: {code}</p>
                <p>Provider: {provider}</p>
            </div>
        </main>
    );
};

export default OAuthLogin;
