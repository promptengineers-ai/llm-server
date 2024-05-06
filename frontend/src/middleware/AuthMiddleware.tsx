'use client';
import { useRouter, usePathname, useParams, redirect } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext"; // Adjust the import path as necessary
import { NextPage } from "next";

export const withAuth = (
    WrappedComponent: NextPage,
    getRoute: (id: string | string[] | undefined) => string,
    minimumPlan: string[]
) => {
    const WithAuthComponent = (props: any) => {
        const pathname = usePathname();
        const { id } = useParams();
        const { logout, token, updateToken } = useAuthContext();

        useEffect(() => {
            const token = localStorage.getItem("token");
            updateToken(token);
            if (!token) {
                logout();
            } else {
                const route = getRoute(id);
                if (pathname !== route) {
                    redirect(route);
                }
            }
        }, [pathname, id, logout, updateToken]);

        if (!token) {
            return (
                <div
                    style={{
                        minHeight: "100vh",
                        padding: "4rem 0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <h1>Please wait...</h1>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };

    WithAuthComponent.displayName = "WithAuth";
    return WithAuthComponent;
};

