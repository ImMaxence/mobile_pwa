import React, { useState, useEffect } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getInfoHiveById } from '../services/hiveService';
import { Skeleton } from 'antd';

const DetailInfoHive = () => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentIdHive = localStorage.getItem('currentHiveId')
                const res = await getInfoHiveById(currentIdHive)
                setData(res)
                setLoading(false)
            } catch (err) {

            }

        }

        setTimeout(() => { fetchData() }, 1000)
    }, [])

    return (
        <LayoutStackNav back_name={'Retour'} back_url={'/detail/hive'}>
            <div style={{ padding: "40px" }}>
                <h4 style={{ padding: '20px 0 40px 0' }}>Informations de la ruche</h4>
                {loading ? (
                    <Skeleton active />

                ) : (
                    <div>
                        <li>ID: {data.id}</li>
                        <li>Nom: {data.nom}</li>
                        <li>Origine Abeille: {data.origin_abeille}</li>
                        <li>Race Reine: {data.race_reine}</li>
                        <li>Couleur Reine: {data.couleur_reine}</li>
                        <li>Nombre de Cadrans: {data.nbr_cadran}</li>
                        <li>Nombre de Hausses: {data.nbr_hausse}</li>
                        <li>Longitude: {data.longitude}</li>
                        <li>Latitude: {data.latitude}</li>
                        <li>Consentement RGPD: {data.concentement_rgpd ? 'Oui' : 'Non'}</li>
                        <li>Consentement Partage: {data.concentement_partage ? 'Oui' : 'Non'}</li>
                        <li>Créé le: {new Date(data.createdAt).toLocaleDateString()}</li>
                        <li>Mis à jour le: {new Date(data.updatedAt).toLocaleDateString()}</li>
                    </div>
                )}
            </div>
        </LayoutStackNav>
    );
};

export default DetailInfoHive;