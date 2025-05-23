import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const MapChart = () => {
    const icon = new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    // Récupérer currentHiveId
    const currentHiveId = localStorage.getItem('currentHiveId');

    // Récupérer les ruches localisées
    const ruchesLocalisees = JSON.parse(localStorage.getItem('ruches_localisees') || '[]');

    // Trouver la ruche concernée
    const ruche = ruchesLocalisees.find(r => r.id === currentHiveId);

    // Si non trouvée
    if (!ruche) {
        return (
            <div style={{ padding: 20 }}>
                <p>Ruche introuvable. Vérifiez que la ruche est bien localisée.</p>
            </div>
        );
    }

    const position = [parseFloat(ruche.latitude), parseFloat(ruche.longitude)];

    return (
        <div style={{ height: "calc(100% + 20px)", width: '100%' }}>
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={icon}>
                    <Popup>
                        <strong>{ruche.nom}</strong><br />
                        Propriétaire : {ruche.proprietaire_nom}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapChart;
