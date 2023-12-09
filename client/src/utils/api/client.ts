import axios from 'axios';
import { AxiosError } from 'axios';
import { API_URL } from '../../config';

const instance = axios.create({
    baseURL: API_URL
});

// Add a request interceptor
instance?.interceptors.request.use(function (config) {
    // Add timeout setting
    config.timeout = 5 * 60 * 1000; // 5 minutes in milliseconds
    return config;
}, function (error: AxiosError) {
    return Promise.reject(error);
});

// Add a response interceptor
instance?.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    const config = error.config;
    if (!config || !config.retries) config.retries = 0;

    config.retries--;

    if (config.retries) {
        return instance(config);
    }

    return Promise.reject(error);
});

export default instance