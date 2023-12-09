import { useContext, createContext, useState, useEffect } from "react";
import { IContextProvider } from "../interfaces/Provider";
import { ReqBodyLogin } from "../interfaces/ReqBody";
import { useNavigate } from 'react-router-dom';
import { ChatClient } from "../utils/api/chat";


const BOT_ACCESS_TOKEN = 'botAccessToken'
const chatClient = new ChatClient();

export const AuthContext = createContext({});
export default function AuthProvider({ children }: IContextProvider) {
	let history = useNavigate();
    const [botAccessToken, setBotAccessToken] = useState<string>(() => {
		const savedToken = localStorage.getItem(BOT_ACCESS_TOKEN);
		return savedToken ?? '';
	});
	const isAuthenticated = botAccessToken !== '';

    async function login(payload: ReqBodyLogin) {
        try {
			const token = btoa(`${payload.username}:${payload.password}`);
			await chatClient.fetchHistoryList(token);
			localStorage.setItem(BOT_ACCESS_TOKEN, token);
            setBotAccessToken(token);
			history('/');
            return token;
        } catch (e: any) {
            console.error(e);
            alert(e.message);
			logout();
        }
    }

    function logout() {
        localStorage.removeItem(BOT_ACCESS_TOKEN);
		setBotAccessToken('');
		history('/login');
	};

	useEffect(() => {
		// Save type to sessionStorage whenever it changes
		if (!botAccessToken) localStorage.setItem(BOT_ACCESS_TOKEN, (botAccessToken as any));
	}, [botAccessToken]);

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                botAccessToken,
				isAuthenticated,
            }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext(): any {
    return useContext(AuthContext);
}