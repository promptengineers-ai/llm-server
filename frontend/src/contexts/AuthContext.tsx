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
import { useInitAuthFromStorageEffect } from "@/hooks/effect/useAuthEffects";
import { AuthClient } from "@/utils/api";
import { access } from "fs";

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
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
            };
        case "LOGOUT":
            localStorage.removeItem("token");
            localStorage.removeItem("user");
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

    const oauthLogin = async (provider: string) => {
        const authClient = new AuthClient();
        await authClient.login(provider);
    }

    const getOauthAccessToken = async (provider: string, code: string) => {
        const response = await fetch(
            `${API_URL}/auth/${provider}/callback?code=${code}`
        );
        const {access_token} = await response.json();
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        await loginUser(access_token);
    };

    const loginUser = async (accessToken: string) => { 
        const userDataResponse = await fetch(`${API_URL}/auth/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userDataResponse.ok) {
            throw new Error(userDataResponse.statusText);
        }

        const userData = await userDataResponse.json();

        dispatch({
            type: "LOGIN",
            payload: { user: { ...userData["user"] }, token: accessToken },
        });

        // Check token expiration
        const decodedToken = jwtDecode<{ exp: number }>(accessToken);
        const expirationTime = decodedToken.exp * 1000 - Date.now();
        setTimeout(logout, expirationTime);

        router.push("/chat");
    };

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
            await loginUser(access_token);
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
        const user = localStorage.getItem("user") || "{}";
        dispatch({ type: "LOGIN", payload: { user: JSON.parse(user), token } });
    }, []);

    const retrieveUser = () => {
        const user = localStorage.getItem("user");
        if (user) {
            return JSON.parse(user);
        }
    };

    useInitAuthFromStorageEffect(dispatch, logout);

    const value = useMemo(
        () => ({
            ...state,
            login,
            logout,
            updateToken,
            retrieveUser,
            oauthLogin,
            getOauthAccessToken,
        }),
        [state, updateToken, getOauthAccessToken]
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
