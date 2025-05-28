import apiUser from './config/apiUserService';

export const register = async (payload) => {
    try {
        const response = await apiUser.post('/api/auth/signup', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logIn = async (payload) => {
    try {
        const response = await apiUser.post('/api/auth/signin', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const decodeToken = async () => {
    try {
        const response = await apiUser.get('/api/auth/decodeToken');
        return response.data;
    } catch (error) {
        throw error;
    }
};
