import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Brush } from 'recharts';
import dayjs from 'dayjs';

const TemperatureChart = ({ data }) => {
    // ⚠️ Trier par date pour un graphe clean
    const sortedData = [...data].sort((a, b) => new Date(a.date_collecte_donnee) - new Date(b.date_collecte_donnee));

    // Optionnel : Formatter les dates
    const formattedData = sortedData.map((item) => ({
        time: dayjs(item.date_collecte_donnee).format('HH:mm'), // ou 'YYYY-MM-DD HH:mm'
        valeur: item.valeur,
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" angle={-45} textAnchor="end" height={60} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="valeur" stroke="#8884d8" strokeWidth={2} dot={false} />
                <Brush dataKey="time" height={30} stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TemperatureChart;
