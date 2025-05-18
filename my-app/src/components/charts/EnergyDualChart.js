import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Brush,
    ResponsiveContainer,
    Legend
} from "recharts";

const formatData = (batteryData, voltageData) => {
    const map = {};

    [...batteryData, ...voltageData].forEach(entry => {
        const key = new Date(entry.date_collecte_donnee).toISOString();
        if (!map[key]) map[key] = {
            date: new Date(entry.date_collecte_donnee).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        if (entry.type.toLowerCase().includes('pourcentage')) {
            map[key].pourcentage = entry.valeur;
        } else if (entry.type.toLowerCase().includes('tension')) {
            map[key].tension = entry.valeur;
        }
    });

    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const EnergyDualChart = ({ batteryData, voltageData }) => {
    if (!batteryData || !voltageData) return <p>Aucune donnée disponible</p>;

    const combinedData = formatData(batteryData, voltageData);

    return (
        <div>

            <ResponsiveContainer width="100%" height={500} style={{ marginBottom: "40px" }}>
                <LineChart data={combinedData}>
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} tickFormatter={(v) => `${v}V`} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="pourcentage" stroke="#0088FE" name="Batterie (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="tension" stroke="#FF8042" name="Tension (V)" />
                    <Brush dataKey="date" height={30} stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EnergyDualChart;