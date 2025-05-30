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

    const currentHiveId = localStorage.getItem('currentHiveId');
    const ruchesLocalisees = JSON.parse(localStorage.getItem('ruches_localisees') || '[]');
    const ruche = ruchesLocalisees.find(r => r.id === currentHiveId);

    if (
        !ruche ||
        !ruche.latitude || !ruche.longitude ||
        parseFloat(ruche.latitude) === 0 || parseFloat(ruche.longitude) === 0
    ) {
        return (
            <div style={{ padding: 20 }}>
                <p>Vous n'êtes pas autorisé à voir la location de cette ruche.</p>
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
                        <div>
                            Propriétaires :
                            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                                {(ruche.proprietaires || [])
                                    .filter(p => p.nom && p.nom.trim() !== '')
                                    .map((p, index) => (
                                        <li key={index}>{p.nom}</li>
                                    ))
                                }
                            </ul>
                            <a
                                href={`https://www.google.com/maps?q=${ruche.latitude},${ruche.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-block', marginTop: '8px', color: '#007bff' }}
                            >
                                📍 Ouvrir dans Google Maps
                            </a>
                        </div>
                    </Popup>

                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapChart;
