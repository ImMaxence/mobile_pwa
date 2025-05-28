import axios from 'axios';
import { getToken } from '../../utils/manageStorage';

export const apiUser = axios.create({
    baseURL: process.env.REACT_APP_URL_BACK_USER,
});

apiUser.interceptors.request.use(
    async (config) => {
        console.log('[API USER SERVICE WEB] 🚀 - Request...');

        const token = await getToken();
        console.log(token)
        if (token) {
            config.headers['x-access-token'] = token;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiUser.interceptors.response.use(
    (response) => {
        console.log('[API USER SERVICE WEB] 👮‍♂️ - Good');
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || 'Erreur inconnue';
        console.error('[API USER SERVICE WEB] ❌ - Error:', message);
        return Promise.reject(message);
    }
);

export default apiUser;
