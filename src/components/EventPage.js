import React from 'react';

const alertColors = {
    "Chute": "#f87171", // rouge
    "Frelons": "#fbbf24", // jaune
    "Température extrêmement haute": "#f97316",
    "Température haute": "#fb923c",
    "Température extrêmement basse": "#60a5fa",
    "Température basse": "#93c5fd",
    "Humidité extrêmement haute": "#38bdf8",
    "Humidité haute": "#7dd3fc",
    "Humidité extrêmement basse": "#a5b4fc",
    "Humidité basse": "#c4b5fd"
};

const EventCard = ({ alerte }) => {
    const { typeAlerte, createdAt } = alerte;
    const color = alertColors[typeAlerte.type_alerte] || "#e5e7eb"; // fallback: gris

    return (
        <div className='just_sha' style={{
            borderLeft: `6px solid ${color}`,
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px"
        }}>
            <h3 style={{ margin: "0 0 8px", color: color }}>{typeAlerte.titre}</h3>
            <p style={{ margin: 0 }}>{typeAlerte.message}</p>
            <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "8px" }}>
                {new Date(createdAt).toLocaleString()}
            </p>
        </div>
    );
};

const EventPage = ({ data }) => {
    const sortedData = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div style={{ padding: "24px", width: "100%", margin: "20px 0" }}>
            <h2 style={{ textAlign: "center", marginBottom: "24px" }}>📋 Liste des alertes</h2>
            {sortedData.map(alerte => (
                <EventCard key={alerte.id} alerte={alerte} />
            ))}
            {sortedData.length === 0 && (
                <p style={{ textAlign: "center" }}>Aucune alerte à afficher.</p>
            )}
        </div>
    );
};

export default EventPage;
