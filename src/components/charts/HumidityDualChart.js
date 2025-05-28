import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Brush,
    ResponsiveContainer,
} from 'recharts';

const HumidityDualChart = ({ humIntData, humExtData }) => {
    if (!humIntData || !humExtData || humIntData.length === 0 || humExtData.length === 0)
        return <p style={{ padding: "20px" }}>Aucune donnée disponible</p>;

    // On suppose que les deux tableaux ont des timestamps similaires, on fait un merge simple sur la date
    // Ici, on fait la jointure sur date_collecte_donnee
    // On pourrait améliorer en prenant l'union et fusionnant proprement, mais pour faire simple :

    const mapExt = new Map(humExtData.map(d => [d.date_collecte_donnee, d.valeur]));
    const mergedData = humIntData
        .filter(d => mapExt.has(d.date_collecte_donnee))
        .map(d => ({
            date: new Date(d.date_collecte_donnee).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }),
            humidityInt: d.valeur,
            humidityExt: mapExt.get(d.date_collecte_donnee),
        }));

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Humidité intérieure / extérieure (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mergedData}>
                    <XAxis dataKey="date" />
                    <YAxis
                        yAxisId="left"
                        domain={[0, 100]}
                        tickFormatter={(tick) => `${tick}%`}
                        label={{ value: 'Intérieure (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                        tickFormatter={(tick) => `${tick}%`}
                        label={{ value: 'Extérieure (%)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="humidityInt"
                        stroke="#8884d8"
                        name="Humidité Intérieure"
                        dot={false}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="humidityExt"
                        stroke="#82ca9d"
                        name="Humidité Extérieure"
                        dot={false}
                    />
                    <Brush dataKey="date" height={30} stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HumidityDualChart;
