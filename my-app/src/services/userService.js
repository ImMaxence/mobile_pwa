import apiUser from './config/apiUserService';

export const searchUserByName = async (name) => {
    try {
        const response = await apiUser.post('/api/get/userSearch', {
            searchQuery: name,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
