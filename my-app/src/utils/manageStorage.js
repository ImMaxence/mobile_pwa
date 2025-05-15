import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔐 Token
export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        return token;
    } catch (error) {
        console.error('[GET TOKEN] : No token :', error);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('accessToken');
    } catch (error) {
        console.error('[REMOVE TOKEN] : Error deleting token :', error);
    }
};

// 👤 User Info
export const getUserEmail = async () => {
    try {
        return await AsyncStorage.getItem('email');
    } catch (error) {
        console.error('[GET EMAIL] :', error);
        return null;
    }
};

export const getFirstNameUser = async () => {
    try {
        return await AsyncStorage.getItem('prenom');
    } catch (error) {
        console.error('[GET FIRST NAME] :', error);
        return null;
    }
};

export const getLastNameUser = async () => {
    try {
        return await AsyncStorage.getItem('nom');
    } catch (error) {
        console.error('[GET LAST NAME] :', error);
        return null;
    }
};

export const getAvatarUser = async () => {
    try {
        return await AsyncStorage.getItem('avatar');
    } catch (error) {
        console.error('[GET AVATAR] :', error);
        return null;
    }
};

// 🐝 Hive Info
export const getCurrentIdHive = async () => {
    try {
        return await AsyncStorage.getItem('hiveId');
    } catch (error) {
        console.error('[GET CURRENT HIVE ID] :', error);
        return null;
    }
};

export const getCurrentIdHive2 = async () => {
    // ❌ Faux – Ne pas utiliser
    try {
        return await AsyncStorage.getItem('idHive');
    } catch (error) {
        console.error('[GET HIVE ID 2] :', error);
        return null;
    }
};

export const getCurrentIdHive3 = async () => {
    try {
        return await AsyncStorage.getItem('idHive3');
    } catch (error) {
        console.error('[GET HIVE ID 3] :', error);
        return null;
    }
};

// 🧑‍🤝‍🧑 User
