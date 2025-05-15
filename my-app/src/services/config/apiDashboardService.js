import axios from 'axios';
import { getToken } from '../../utils/manageStorage';

const getToken = async () => {
    return localStorage.getItem('token');
};

const apiDash = axios.create({
    baseURL: process.env.URL_BACK_DASHBOARD,
});

apiDash.interceptors.request.use(
    async (config) => {
        console.log('[API DASHBOARD SERVICE WEB] 🚀 - Request...');

        const token = await getToken();
        if (token) {
            config.headers['x-access-token'] = token;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiDash.interceptors.response.use(
    (response) => {
        console.log('[API DASHBOARD SERVICE WEB] 👮‍♂️ - Good');
        return response;
    },
    (error) => {
        console.error('[API DASHBOARD SERVICE WEB] ❌ - Problem token or other error:', error.response?.data?.message || error);

        if (error.response?.data?.message) {
            return Promise.reject(error.response.data.message);
        } else if (error.response?.data?.error) {
            return Promise.reject(error.response.data.error);
        } else {
            return Promise.reject('Unknown error');
        }
    }
);

export default apiDash;
