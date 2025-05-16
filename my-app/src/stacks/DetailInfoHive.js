import React, { useState, useEffect } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getInfoHiveById } from '../services/hiveService';

const DetailInfoHive = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const currentIdHive = localStorage.getItem('currentHiveId')
            const res = await getInfoHiveById(currentIdHive)
            setData(res)
        }

        fetchData()
    }, [])

    return (
        <LayoutStackNav back_name={'Retour'} back_url={'/detail/hive'}>
            {data ? (
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
            ) : (
                <p>Chargement...</p>
            )}
        </LayoutStackNav>
    );
};

export default DetailInfoHive;