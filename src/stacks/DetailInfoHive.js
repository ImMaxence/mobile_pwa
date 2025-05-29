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
                console.log(res)
            } catch (err) {

            }

        }

        setTimeout(() => { fetchData() }, 650)
    }, [])

    return (
        <LayoutStackNav back_name={'Retour'} back_url={'/detail/hive'}>
            <div style={{ padding: "40px" }}>
                <h4 style={{ padding: '20px 0 20px 0' }}>Informations de la ruche</h4>
                {loading ? (
                    <Skeleton active />

                ) : (
                    <div className="data-card">
                        <ul>
                            <li><strong>ID:</strong> {data.id}</li>
                            <li><strong>Nom:</strong> {data.nom}</li>
                            <li><strong>Origine Abeille:</strong> {data.origin_abeille}</li>
                            <li><strong>Race Reine:</strong> {data.race_reine}</li>
                            <li><strong>Couleur Reine:</strong> {data.couleur_reine}</li>
                            <li><strong>Nombre de Cadrans:</strong> {data.nbr_cadran}</li>
                            <li><strong>Nombre de Hausses:</strong> {data.nbr_hausse}</li>
                            <li><strong>Longitude:</strong> {data.longitude}</li>
                            <li><strong>Latitude:</strong> {data.latitude}</li>
                            <li><strong>Consentement RGPD:</strong> {data.concentement_rgpd ? 'Oui' : 'Non'}</li>
                            <li><strong>Consentement Partage:</strong> {data.concentement_partage ? 'Oui' : 'Non'}</li>
                            <li><strong>Créé le:</strong> {new Date(data.createdAt).toLocaleDateString()}</li>
                            <li><strong>Mis à jour le:</strong> {new Date(data.updatedAt).toLocaleDateString()}</li>
                        </ul>
                    </div>

                )}
            </div>
        </LayoutStackNav>
    );
};

export default DetailInfoHive;