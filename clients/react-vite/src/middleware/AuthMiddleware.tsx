import { useLocation, Navigate } from 'react-router-dom';
import { ComponentType, useEffect } from 'react';

export const withAuth = <P extends object>(Component: ComponentType<P>) => {
    const WithAuthComponent = (props: P) => {
        const location = useLocation();
        const isAuthenticated = localStorage.getItem("token") !== null;

        useEffect(() => {
            // Check token expiration here if needed
        }, []);

        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            return <Navigate to="/" state={{ from: location }} replace />;
        }

        return <Component {...props} />;
    };

    return WithAuthComponent;
}; 