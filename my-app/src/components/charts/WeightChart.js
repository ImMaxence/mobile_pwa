import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Brush,
    ResponsiveContainer
} from "recharts";

const WeightChart = ({ data }) => {
    if (!data || data.length === 0) return <p>Aucune donnée disponible</p>;

    // Formatage des données
    const formattedData = data.map(d => ({
        weight: d.valeur,
        date: new Date(d.date_collecte_donnee).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }));

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Poids (kg)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#82ca9d" name="Poids (kg)" />
                    <Brush dataKey="date" height={30} stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeightChart;
