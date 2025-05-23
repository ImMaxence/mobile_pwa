import { getCurrentGroupId } from '../utils/manageStorage';
import apiDash from './config/apiDashboardService';

export const getGroups = async () => {
    try {
        const res = await apiDash.get('/api/groupement_ruche');
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const createGroup = async (payload) => {
    try {
        const res = await apiDash.post('/api/groupement_ruche', payload);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const addHiveToGroup = async (id, payload) => {
    try {
        const res = await apiDash.put(`/api/groupement_ruche/${id}/add/ruche`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getDataFromGroup = async (idGroup) => {
    try {
        const res = await apiDash.get(`/api/groupement_ruche/${idGroup}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getHivesUser = async () => {
    try {
        const res = await apiDash.get('/api/groupement_ruche');
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getDataDash = async (histo, payload) => {
    try {
        const res = await apiDash.post(`/api/capteur/?historique=${histo}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const leaveGroup = async (userId, payload) => {
    try {
        const res = await apiDash.put(`/api/groupement_ruche/${userId}/remove/user`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const addUserToGroup = async (groupId, userId) => {
    try {
        const res = await apiDash.put(`/api/groupement_ruche/${groupId}/add/user`, { userId });
        return res.data;
    } catch (error) {
        throw error;
    }
};

// Notes (Rapport Ruche)
export const getNote = async (id) => {
    try {
        const res = await apiDash.get(`/api/note_ruche?id_ruche=${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const createNote = async (payload) => {
    try {
        const res = await apiDash.post('/api/note_ruche', payload);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const deleteNote = async (id) => {
    try {
        const res = await apiDash.delete(`/api/note_ruche/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const updateNote = async (id, payload) => {
    try {
        const res = await apiDash.put(`/api/note_ruche/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const deleteHiveToGroup = async (id, payload) => {
    try {
        const res = await apiDash.put(`/api/groupement_ruche/${id}/remove/ruche`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const updateGroup = async (id, payload) => {
    try {
        const res = await apiDash.put(`/api/groupement_ruche/${id}/edit`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getInfoHiveById = async (id) => {
    try {
        const res = await apiDash.get(`/api/ruches`, { id_ruche: id });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const updateInfoHive = async (id_ruche, payload) => {
    try {
        const res = await apiDash.put(`/api/ruches/${id_ruche}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const getAlerts = async (idRuche) => {
    try {
        const res = await apiDash.get(`api/alerte/api/get/AlertesByRuche/${idRuche}`)
        return res.data
    } catch (err) {
        throw (err)
    }
}

export const delAlert = async (id) => {
    try {
        const res = await apiDash.delete(`/api/delete/deleteAlerte/${id}`)
        return res.data
    } catch (err) {
        throw (err)
    }
}