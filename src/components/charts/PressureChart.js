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

const PressureChart = ({ data }) => {
    if (!data || data.length === 0) return <p style={{ padding: "20px" }}>Aucune donnée disponible</p>;

    const formattedData = data.map(d => ({
        pressure: d.valeur,
        date: new Date(d.date_collecte_donnee).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }));

    return (
        <div>
            <h3>Pression externe (hPa)</h3>
            <ResponsiveContainer width="100%" height={500}>
                <LineChart data={formattedData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="pressure" stroke="#FF8042" name="Pression (hPa)" />
                    <Brush dataKey="date" height={30} stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PressureChart;
