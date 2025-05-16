import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer
} from 'recharts';

const HumidityChart = ({ data }) => {
    // data est un tableau d’objets, chaque objet doit contenir au moins :
    // - date_collecte_donnee (ou un champ date pour l’axe X)
    // - valeur (valeur humidité)

    // Exemple d’adaptation pour la date en format lisible (optionnel)
    const formattedData = data.map(item => ({
        date: new Date(item.date_collecte_donnee).toLocaleString(),
        valeur: item.valeur,
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valeur" stroke="#8884d8" dot={false} />
                <Brush dataKey="date" height={30} stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default HumidityChart;
