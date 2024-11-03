import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { ComponentType } from "react";

export const withAuth = (
    WrappedComponent: ComponentType<any>,
    getRoute: (id: string | undefined) => string,
    // minimumPlan: string[]
) => {
    const WithAuthComponent = (props: any) => {
        const location = useLocation();
        const { id } = useParams();
        const navigate = useNavigate();
        const { logout, token, updateToken } = useAuthContext();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const localToken = localStorage.getItem("token");
            updateToken(localToken);
            
            if (!localToken) {
                logout();
                setIsLoading(false);
            } else {
                const route = getRoute(id);
                if (location.pathname !== route) {
                    navigate(route);
                }
                setIsLoading(false);
            }
        }, [location.pathname, id, logout, updateToken]);

        if (isLoading) {
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

        return token ? <WrappedComponent {...props} /> : null;
    };

    WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return WithAuthComponent;
};

