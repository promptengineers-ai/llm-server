import { Dispatch, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const useInitAuthFromStorageEffect = (
    dispatch: Dispatch<any>,
    logout: any
) => {
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        // Check if token or user is invalid
        if (!token || token === "null" || !user || user === "{}") {
            logout();
            return;
        }

        // Parse the user and check its validity
        try {
            const parsedUser = JSON.parse(user);
            if (!parsedUser || Object.keys(parsedUser).length === 0) {
                logout();
                return;
            }

            dispatch({
                type: "LOGIN",
                payload: { user: parsedUser, token: token },
            });
        } catch (error) {
            logout();
            return;
        }

        // Check token expiration
        try {
            const decodedToken = jwtDecode<{ exp: number }>(token);
            const expirationTime = decodedToken.exp * 1000 - Date.now();

            if (expirationTime <= 0) {
                logout();
            } else {
                setTimeout(logout, expirationTime);
            }
        } catch (error) {
            logout();
        }
    }, [dispatch, logout]);
};
