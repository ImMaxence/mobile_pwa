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
    const franceBounds = [
        [41.303, -5.142],
        [51.124, 9.560]
    ];

    const ruchesLocalisees = JSON.parse(localStorage.getItem('ruches_localisees') || '[]');

    const ruchesFiltrees = ruchesLocalisees.filter(ruche =>
        ruche.latitude && ruche.longitude &&
        parseFloat(ruche.latitude) !== 0 &&
        parseFloat(ruche.longitude) !== 0
    );

    const hasRuches = ruchesFiltrees.length > 0;

    return (
        <Layout>
            <div className='map_spe'>
                {!hasRuches ? (
                    <div style={{ padding: 20 }}>
                        <p>
                            Veuillez vous connecter et ajouter votre ruche dans <strong>"Mes Groupes"</strong> avant de la voir sur la carte.
                        </p>
                    </div>
                ) : (
                    <MapContainer bounds={franceBounds} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {ruchesFiltrees.map((ruche) => (
                            <Marker
                                key={ruche.id}
                                position={[parseFloat(ruche.latitude), parseFloat(ruche.longitude)]}
                                icon={icon}
                            >
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
                        ))}
                    </MapContainer>
                )}
            </div>
        </Layout>
    );
};

export default Map;
