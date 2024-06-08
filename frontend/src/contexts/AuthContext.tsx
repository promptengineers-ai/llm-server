"use client";
import {
    useContext,
    createContext,
    useReducer,
    useMemo,
    useEffect,
    useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { IContextProvider } from "../interfaces/provider";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/app";

export const AuthContext = createContext({});

// Define the initial state for the context
const initialState = {
    user: null,
    token: null,
};

// Define a reducer function that updates state based on the action type
function authReducer(state: any, action: any) {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("token", action.payload.token);
            sessionStorage.setItem("user", JSON.stringify(action.payload.user));
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
            };
        case "LOGOUT":
            localStorage.removeItem("token");
            sessionStorage.removeItem("user");
            return {
                ...state,
                user: null,
                token: null,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export default function AuthProvider({ children }: IContextProvider) {
    const router = useRouter();
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Effect to initialize state from localStorage on client side only
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = sessionStorage.getItem("user") || "{}";
        if (token || user) {
            // Optionally validate the token and fetch user details
            dispatch({
                type: "LOGIN",
                payload: { user: JSON.parse(user), token: token },
            });
        }

        // Check token expiration
        if (token) {
            const decodedToken = jwtDecode<{ exp: number }>(token);
            const expirationTime = decodedToken.exp * 1000 - Date.now();
            if (expirationTime <= 0) {
                logout();
            } else {
                setTimeout(logout, expirationTime);
            }
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const loginResponse = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!loginResponse.ok) {
                throw new Error(loginResponse.statusText);
            }

            const { access_token } = await loginResponse.json();

            // Fetch additional user data after successful login
            const userDataResponse = await fetch(`${API_URL}/auth/user`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (!userDataResponse.ok) {
                throw new Error(loginResponse.statusText);
            }

            const userData = await userDataResponse.json();

            dispatch({
                type: "LOGIN",
                payload: { user: { ...userData["user"] }, token: access_token },
            });

            // Check token expiration
            const decodedToken = jwtDecode<{ exp: number }>(access_token);
            const expirationTime = decodedToken.exp * 1000 - Date.now();
            setTimeout(logout, expirationTime);

            router.push("/chat");
        } catch (error) {
            console.error("Login Failed:", error);
            alert(error);
            throw error; // Re-throw to handle it in the component if needed
        }
    }, []);

    const logout = useCallback(() => {
        router.push("/");
        dispatch({ type: "LOGOUT" });
    }, []);

    const updateToken = useCallback((token: string) => {
        const user = sessionStorage.getItem("user") || "{}";
        dispatch({ type: "LOGIN", payload: { user: JSON.parse(user), token } });
    }, []);

    const retrieveUser = () => {
        const user = sessionStorage.getItem("user");
        if (user) {
            return JSON.parse(user);
        }
    };

    const value = useMemo(
        () => ({
            ...state,
            login,
            logout,
            updateToken,
            retrieveUser,
        }),
        [state, updateToken]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuthContext(): any {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
}
