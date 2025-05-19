import React, { useRef } from 'react';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale,
    zoomPlugin
);

const formatChartData = (tempIntData, tempExtData) => {
    if (!tempIntData || !tempExtData) return { labels: [], datasets: [] };

    // On crée une map pour fusionner par date (ISO string)
    const mergedMap = new Map();

    tempIntData.forEach(d => {
        const dateKey = new Date(d.date_collecte_donnee).toISOString();
        if (!mergedMap.has(dateKey)) mergedMap.set(dateKey, { date: new Date(d.date_collecte_donnee) });
        mergedMap.get(dateKey).tempInt = d.valeur;
    });

    tempExtData.forEach(d => {
        const dateKey = new Date(d.date_collecte_donnee).toISOString();
        if (!mergedMap.has(dateKey)) mergedMap.set(dateKey, { date: new Date(d.date_collecte_donnee) });
        mergedMap.get(dateKey).tempExt = d.valeur;
    });

    const mergedArray = Array.from(mergedMap.values()).sort((a, b) => a.date - b.date);

    return {
        labels: mergedArray.map(d => d.date),
        datasets: [
            {
                label: 'Température Intérieure (°C)',
                data: mergedArray.map(d => d.tempInt ?? null),
                borderColor: '#FF7300',
                backgroundColor: 'rgba(255, 115, 0, 0.2)',
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2,
            },
            {
                label: 'Température Extérieure (°C)',
                data: mergedArray.map(d => d.tempExt ?? null),
                borderColor: '#387908',
                backgroundColor: 'rgba(56, 121, 8, 0.2)',
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2,
            },
        ],
    };
};

const TemperatureDualChartZoomable = ({ tempIntData, tempExtData }) => {
    const chartRef = useRef();
    const data = formatChartData(tempIntData, tempExtData);

    if (!tempIntData || !tempExtData) return <p>Données manquantes</p>;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',        // Affiche toutes les séries à un point X donné
            intersect: false      // Ne nécessite pas d'être exactement sur un point
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    tooltipFormat: 'PPpp',
                    unit: 'hour',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                type: 'linear',
                position: 'left',
                min: -10,
                max: 40,
                title: {
                    display: true,
                    text: 'Température (°C)',
                },
            },
        },
        plugins: {
            zoom: {
                limits: {
                    y: { min: 'original', max: 'original' },
                },
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'x',
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                },
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
    };


    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
};

export default TemperatureDualChartZoomable;
