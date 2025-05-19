import React from 'react';
import Layout from '../components/Layout';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Définir les icônes Leaflet
const icon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const Map = () => {
    // Centrage sur toute la France
    const franceBounds = [
        [41.303, -5.142], // Sud-Ouest
        [51.124, 9.560]   // Nord-Est
    ];

    // Lire et parser les ruches localisées
    const ruchesLocalisees = JSON.parse(localStorage.getItem('ruches_localisees') || '[]');

    // Vérification s'il y a des données valides
    const hasRuches = Array.isArray(ruchesLocalisees) && ruchesLocalisees.length > 0;

    return (
        <Layout>
            <div className='map_spe'>
                {!hasRuches ? (
                    <div style={{ padding: 20 }}>
                        <p >
                            Veuillez vous connecter et ajouter votre ruche dans <strong>"Mes Groupes"</strong> avant de la voir sur la carte.
                        </p>
                    </div>
                ) : (
                    <MapContainer bounds={franceBounds} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {ruchesLocalisees.map((ruche) => (
                            <Marker
                                key={ruche.id}
                                position={[parseFloat(ruche.latitude), parseFloat(ruche.longitude)]}
                                icon={icon}
                            >
                                <Popup>
                                    <strong>{ruche.nom}</strong><br />
                                    Propriétaire : {ruche.proprietaire_nom}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </Layout>
    );
};

export default Map;
