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

export const updateUser = async (id, email, pren, nom, ava) => {
    try {
        const res = await apiUser.put(`/api/update/profil/${id}`, {
            email: email,
            nom: nom,
            prenom: pren,
            avatar: ava,
        })
        return res.data
    } catch (error) {
        throw error
    }
}

export const deleteUser = async (id) => {
    try {
        const res = await apiUser.delete(`/api/delete/profil/${id}`)
        return res.data
    } catch (error) {
        throw error
    }
}

export const updatePassword = async (id, new1, new2) => {
    try {
        const res = await apiUser.put(`/api/get/modMdp/${id}`, {
            newPassword: new1,
            confirmPassword: new2
        })
        return res.data
    } catch (error) {
        throw error
    }
}