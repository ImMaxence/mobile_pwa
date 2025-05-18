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

const formatChartData = (humidityData) => {
    // On trie et formate les données
    const sorted = humidityData
        .map((entry) => ({
            date: new Date(entry.date_collecte_donnee),
            valeur: entry.valeur,
        }))
        .sort((a, b) => a.date - b.date);

    return {
        labels: sorted.map((d) => d.date),
        datasets: [
            {
                label: 'Humidité (%)',
                data: sorted.map((d) => d.valeur),
                borderColor: '#8884d8',
                backgroundColor: 'rgba(136, 132, 216, 0.2)',
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 7,
                pointHoverBorderWidth: 2,
            },
        ],
    };
};

const HumidityChartZoomable = ({ data }) => {
    const chartRef = useRef();
    const chartData = formatChartData(data);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    tooltipFormat: 'PPpp',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                type: 'linear',
                position: 'left',
                min: 0,
                max: 100,
                title: {
                    display: true,
                    text: 'Humidité (%)',
                },
            },
        },
        plugins: {
            zoom: {
                limits: {
                    y: { min: 0, max: 100 }, // axe Y fixe
                },
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'x', // zoom/pan horizontal uniquement
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                },
            },
            tooltip: {
                enabled: true,
                mode: 'nearest',
                intersect: false,
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '550px' }}>
            <Line ref={chartRef} data={chartData} options={options} />
        </div>
    );
};

export default HumidityChartZoomable;
