import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer
} from 'recharts';

const HumidityChart = ({ data }) => {
    // formate la date pour afficher lisiblement sur l'axe X
    const formattedData = data.map(item => ({
        date: new Date(item.date_collecte_donnee),
        dateLabel: new Date(item.date_collecte_donnee).toLocaleString(),
        valeur: item.valeur,
    }));

    const [activeIndex, setActiveIndex] = useState(null);

    // pour grossir le point sélectionné
    const handleMouseEnter = (_, index) => setActiveIndex(index);
    const handleMouseLeave = () => setActiveIndex(null);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="dateLabel"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval="preserveStartEnd"
                    minTickGap={20}
                />
                <YAxis domain={[0, 100]} /> {/* Ajuste ici selon ta plage */}
                <Tooltip labelFormatter={label => `Date: ${label}`} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="valeur"
                    stroke="#8884d8"
                    dot={({ index }) => (
                        <circle
                            r={index === activeIndex ? 8 : 3}
                            fill="#8884d8"
                            stroke={index === activeIndex ? '#000' : 'none'}
                            strokeWidth={index === activeIndex ? 2 : 0}
                            onMouseEnter={() => handleMouseEnter(null, index)}
                            onMouseLeave={handleMouseLeave}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                    activeDot={{ r: 8 }}
                />
                <Brush dataKey="dateLabel" height={30} stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default HumidityChart;
