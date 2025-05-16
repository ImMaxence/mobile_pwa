import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Brush,
    ResponsiveContainer,
} from 'recharts';

const TemperatureDualChart = ({ tempIntData, tempExtData }) => {
    if (!tempIntData || !tempExtData) return <p>Données manquantes</p>;

    // Fusionner les deux datasets par date (formatée)
    const formatDate = dateStr =>
        new Date(dateStr).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

    const mergedMap = new Map();

    tempIntData.forEach(d => {
        const date = formatDate(d.date_collecte_donnee);
        if (!mergedMap.has(date)) mergedMap.set(date, { date });
        mergedMap.get(date).tempInt = d.valeur;
    });

    tempExtData.forEach(d => {
        const date = formatDate(d.date_collecte_donnee);
        if (!mergedMap.has(date)) mergedMap.set(date, { date });
        mergedMap.get(date).tempExt = d.valeur;
    });

    // Convertir en tableau ordonné par date
    const mergedData = Array.from(mergedMap.values()).sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Températures (°C)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mergedData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="tempInt" stroke="#FF7300" name="Intérieure" />
                    <Line type="monotone" dataKey="tempExt" stroke="#387908" name="Extérieure" />
                    <Brush dataKey="date" height={30} stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TemperatureDualChart;
