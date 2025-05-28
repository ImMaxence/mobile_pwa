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

const BatteryChart = ({ data }) => {
    if (!data || data.length === 0) return <p>Aucune donnée disponible</p>;

    const formattedData = data.map(d => ({
        value: d.valeur,
        date: new Date(d.date_collecte_donnee).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }));

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Batterie (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#0088FE" />
                    <Brush dataKey="date" height={30} stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BatteryChart;
