import apiIA from "./config/apiIAService";

export const getInfoIA = async (lat, long, id) => {
    try {
        const res = apiIA.get(`/periode_pollen/?latitude=${lat}&longitude=${long}&id_ruche=${id}`)
        return res
    } catch (error) {
        throw error
    }
}

export const getNumberBees = async (id) => {
    try {
        const res = apiIA.get(`/nombre_abeille/?id_ruche=${id}`)
        return res
    } catch (err) {
        throw err
    }
}