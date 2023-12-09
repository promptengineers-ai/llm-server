import axios, { AxiosError } from 'axios';
import { API_URL } from "../../config/index";
import client from './client';
import {
    ReqBodyCreateToken,
    ReqBodyFormDefinition,
    ReqBodyFunctionGenerate,
    ReqBodyGeneralPrompt,
    ReqBodyLogin,
    ReqBodyRegister,
    ReqBodyRemoveToken,
    ReqBodySoftwareEngineer,
    ReqBodyUpgrade
} from '../../interfaces/ReqBody';

export class API {
    public getHeaders(token: string, type: string) {
        let headers = {};
        if (type === 'bot') {
            headers = {
                Authorization: `Basic ${token}`,
                'Content-Type': 'application/json'
            };
        } else if (type === 'formio') {
            headers = {
                'x-jwt-token': token,
            };
        } else {
            throw Error("No type was passed to getHeaders");
        }

        return {
            headers: headers,
            withCredentials: true, // include this line to add the withCredentials property
        };
    }
}

export class DocLoader extends API {
	public async multi(token: string, payload: any) {
        const options = this.getHeaders(token, 'bot');
        const res = await client.post(
            `/api/v1/vectorstores`,
            payload,
            options
        );
        return res;
    }

    public async url(token: string, payload: any) {
        const options = this.getHeaders(token, 'bot');
        const res = await client.post(
            `/api/v1/vectorstores`,
            payload,
            options
        );
        return res;
    }

    public async file(token: string, payload: any) {
        const options = this.getHeaders(token, 'bot');
        const headers = options.headers;
        const res = await client.post(
            `/api/v1/vectorstores/file`,
            payload,
            {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return res;
    }

    public async listVectorIndexes(token: string, provider?: string) {
        const options = this.getHeaders(token, 'bot');
        let url = `${API_URL}/api/v1/vectorstores/${provider || 'pinecone'}`;
        const res = await axios.get(
            url,
            options
        );
        return res;
    }

	public async listFiles(token: string) {
        const options = this.getHeaders(token, 'bot');
        let url = `${API_URL}/api/v1/files`;
        const res = await axios.get(
            url,
            options
        );
        return res;
    }
}

export class PromptEngine extends API {
    public async upgradeUser(token: string, payload: ReqBodyUpgrade) {
        try {
            const options = this.getHeaders(token, 'bot');
            const res = await axios.post(
                `${API_URL}/auth/upgrade`,
                payload,
                options
            );
            return res.data;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.error(e);
                throw e;
            } else {
                console.error(e);
                throw e;
            }
        }
    }

    public async downgradeUser(token: string) {
        try {
            const options = this.getHeaders(token, 'bot');
            const res = await axios.post(`${API_URL}/auth/subscription/cancel`, null, options);
            return res.data;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.error(e);
                throw e;
            } else {
                console.error(e);
                throw e;
            }
        }
    }

    public async buildComponent(token: string, payload: any) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.post(
            `${API_URL}/api/v1/generator/component`,
            payload,
            options
        );
        return res;
    }

    public async buildChart(token: string, payload: any) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.post(
            `${API_URL}/api/v1/generator/component/chart`,
            payload,
            options
        );
        return res;
    }

    public async generateFunction(token: string, payload: ReqBodyFunctionGenerate) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.post(
            `${API_URL}/api/v1/generator/function`,
            payload,
            options
        );
        return res;
    }

    public async generateFormDefinition(token: string, payload: ReqBodyFormDefinition) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.post(
            `${API_URL}/api/v1/generator/formio`,
            payload,
            options
        );
        return res.data;
    }

    public async generateSqlQuery(token: string, payload: ReqBodyGeneralPrompt) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.post(
            `${API_URL}/api/v1/prompt/sql`,
            payload,
            options
        );
        return res.data;
    }

    public async actAsSoftwareEngineer(token: string, payload: ReqBodySoftwareEngineer) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.post(
            `${API_URL}/api/v1/personas/software-engineer`,
            payload,
            options
        );
        return res.data;
    }

    /**
     *
     * @param token
     * @param payload
     * @returns
     */
    public async deleteVectorstore(
        token: string,
        payload: { vectorstore: string, provider: string },
    ) {
        const options = this.getHeaders(token, 'bot');
        let url = `${API_URL}/api/v1/vectorstores/${payload.provider}?prefix=${payload.vectorstore}`;
        const res = await axios.delete(
            url,
            options
        );
        return res;
    }

	/**
     *
     * @param token
     * @param payload
     * @returns
     */
    public async anonymizeInput(
        token: string,
        payload: { text: string, entities: string[] },
    ) {
        const options = this.getHeaders(token, 'bot');
        const res = await client.post(
            `/api/v1/prompts/anonymize`,
            payload,
            options
        );
        return res;
    }
}

export class Auth extends API {
    public async retrieveLoginToken(payload: ReqBodyLogin) {
        const res = await axios.post(
            `${API_URL}/auth/login`,
            payload
        );
        return res.data;
    }

    public async registerNewUser(payload: ReqBodyRegister) {
        const res = await axios.post(
            `${API_URL}/auth/register`,
            payload
        );
        return res.data;
    }

    public async createPeronsalAccessToken(
        token: string,
        payload: {key: string}
    ) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.post(
            `${API_URL}/auth/personal-access-tokens`,
            payload,
            options
        );
        return res.data;
    }

    public async updatePeronsalAccessToken(
        token: string,
        payload: { name: string, state: number }
    ) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.put(
            `${API_URL}/auth/personal-access-tokens/${payload.name}?state=${payload.state ? 1 : 0}`,
            payload,
            options
        );
        return res.data;
    }

    public async retrievePeronsalAccessTokens(
        token: string
    ) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.get(
            `${API_URL}/auth/personal-access-tokens`,
            options
        );
        return res;
    }

    public async deletePeronsalAccessToken(
        token: string,
        payload: {name: string},
    ) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.delete(
            `${API_URL}/auth/personal-access-tokens/${payload.name}`,
            options
        );
        return res;
    }

    public async retrieveApiTokens(token: string) {
        try {
            const options = this.getHeaders(token, 'bot');
            const res = await axios.get(
                `${API_URL}/auth/tokens`,
                options
            );
            return res.data;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.error(e);
                return;
            } else {
                console.error(e);
                return;
            }
        }
    }

    public async addKeyToTokenStore(
        token: string,
        payload: ReqBodyCreateToken
    ) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.put(
            `${API_URL}/auth/tokens`,
            payload,
            options
        );
        return res.data;
    }

    public async removeApiToken(token: string, payload: ReqBodyRemoveToken) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.delete(
            `${API_URL}/auth/tokens`,
            { ...options, data: payload }
        );
        return res.data;
    }

    public async tokenUsage(token: string) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.get(
            `${API_URL}/auth/usage`,
            options
        );
        return res.data;
    }

    public async updateAccountPassword(
        token: string,
        payload: { password: string, confirmPassword: string }
    ) {
        try {
            const options = this.getHeaders(token, 'bot');
            const res = await axios.post(
                `${API_URL}/auth/change-password`,
                payload,
                options
            );
            return res.data;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.error(e);
                return;
            } else {
                console.error(e);
                return;
            }
        }
    }

    public async recoverPassword(
        payload: { email: string }
    ) {
        try {
            const res = await axios.post(
                `${API_URL}/auth/reset-password`,
                payload
            );
            return res.data;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.error(e);
                return;
            } else {
                console.error(e);
                return;
            }
        }
    }

    public async verifyAccount(token: string) {
        try {
            const res = await axios.get(`${API_URL}/auth/verify?code=${token}`);
            return res.data;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.error(e);
                throw e;
            } else {
                console.error(e);
                throw e;
            }
        }
    }

    public async authUser(token: string) {
        const options = this.getHeaders(token, 'bot');
        const res = await axios.get(
            `${API_URL}/auth/user`,
            options
        );
        return res.data.user.data;
    }
}