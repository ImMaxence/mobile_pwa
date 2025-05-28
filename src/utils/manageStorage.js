
// 🔐 Token
export const getToken = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        return token;
    } catch (error) {
        console.error('[GET TOKEN] : No token :', error);
        return null;
    }
};

export const removeToken = async () => {
    try {
        localStorage.removeItem('accessToken');
    } catch (error) {
        console.error('[REMOVE TOKEN] : Error deleting token :', error);
    }
};

// 👤 User Info
export const getUserEmail = async () => {
    try {
        return localStorage.getItem('email');
    } catch (error) {
        console.error('[GET EMAIL] :', error);
        return null;
    }
};

export const getFirstNameUser = async () => {
    try {
        return localStorage.getItem('prenom');
    } catch (error) {
        console.error('[GET FIRST NAME] :', error);
        return null;
    }
};

export const getLastNameUser = async () => {
    try {
        return localStorage.getItem('nom');
    } catch (error) {
        console.error('[GET LAST NAME] :', error);
        return null;
    }
};

export const getAvatarUser = async () => {
    try {
        return localStorage.getItem('avatar');
    } catch (error) {
        console.error('[GET AVATAR] :', error);
        return null;
    }
};

// ❌ Faux – Ne pas utiliser
export const getCurrentIdHive = async () => {
    try {
        return localStorage.getItem('hiveId');
    } catch (error) {
        console.error('[GET CURRENT HIVE ID] :', error);
        return null;
    }
};

export const getCurrentIdHive2 = async () => {
    // ❌ Faux – Ne pas utiliser
    try {
        return localStorage.getItem('idHive');
    } catch (error) {
        console.error('[GET HIVE ID 2] :', error);
        return null;
    }
};

export const getCurrentIdHive3 = async () => {
    try {
        return localStorage.getItem('idHive3');
    } catch (error) {
        console.error('[GET HIVE ID 3] :', error);
        return null;
    }
};

export const getCurrentGroupId = async () => {
    try {
        const data = localStorage.getItem('currentGroupId')
        return data
    } catch (error) {
        console.error('[GET GROUP ID] : ', error)
        return null
    }
}

export const getCurrentGroupType = async () => {
    try {
        const data = localStorage.getItem('currentGroupType')
        return data
    } catch (error) {
        console.error('[GET GROUP TYPE] : ', error)
        return null
    }
}

export const getUserId = async () => {
    try {
        const data = localStorage.getItem('userId')
        return data
    } catch (error) {
        console.error('[GET USER ID] : ', error)
        return null
    }
}