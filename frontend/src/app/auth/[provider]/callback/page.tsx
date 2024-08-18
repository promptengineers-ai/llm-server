"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

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
        <main
            className="flex min-h-screen flex-col"
            style={{ position: "relative" }}
        >
            <div
                className={`flex-1 flex flex-col justify-center px-6 py-12 lg:px-8`}
            >
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    {provider === "google" && (
                        <>
                            <FaGoogle className="mx-auto text-8xl" />
                            <span>Authenticating</span>
                            <span className="ellipsis text-2xl"></span>
                        </>
                    )}
                    {provider === "github" && (
                        <>
                            <FaGithub className="mx-auto text-8xl" />
                            <span>Authenticating</span>
                            <span className="ellipsis text-2xl"></span>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default OAuthLogin;
