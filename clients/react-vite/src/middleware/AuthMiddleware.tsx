'use client';
import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { ComponentType } from "react";

export const withAuth = (
    WrappedComponent: ComponentType<any>,
    getRoute: (id: string | undefined) => string,
    minimumPlan: string[]
) => {
    const WithAuthComponent = (props: any) => {
        const location = useLocation();
        const { id } = useParams();
        const navigate = useNavigate();
        const { logout, token, updateToken } = useAuthContext();

        useEffect(() => {
            const token = localStorage.getItem("token");
            updateToken(token);
            if (!token) {
                logout();
            } else {
                const route = getRoute(id);
                if (location.pathname !== route) {
                    navigate(route);
                }
            }
        }, [location.pathname, id, logout, updateToken, navigate]);

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

    WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return WithAuthComponent;
};

