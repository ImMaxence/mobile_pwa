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

const formatChartData = (batteryData, voltageData) => {
    const map = {};

    [...batteryData, ...voltageData].forEach(entry => {
        const key = new Date(entry.date_collecte_donnee).toISOString();
        if (!map[key]) map[key] = { date: new Date(entry.date_collecte_donnee) };
        if (entry.type.toLowerCase().includes('pourcentage')) {
            map[key].pourcentage = entry.valeur;
        } else if (entry.type.toLowerCase().includes('tension')) {
            map[key].tension = entry.valeur;
        }
    });

    const sorted = Object.values(map).sort((a, b) => a.date - b.date);

    return {
        labels: sorted.map(d => d.date),
        datasets: [
            {
                label: 'Batterie (%)',
                data: sorted.map(d => d.pourcentage),
                yAxisID: 'y1',
                borderColor: '#0088FE',
                backgroundColor: 'rgba(0, 136, 254, 0.2)',
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 7,
                pointHoverBorderWidth: 2,
            },
            {
                label: 'Tension (V)',
                data: sorted.map(d => d.tension),
                yAxisID: 'y2',
                borderColor: '#FF8042',
                backgroundColor: 'rgba(255, 128, 66, 0.2)',
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 7,
                pointHoverBorderWidth: 2,
            },
        ],
    };
};

const EnergyDualChartZoomable = ({ batteryData, voltageData }) => {
    const chartRef = useRef();
    const data = formatChartData(batteryData, voltageData);

    const options = {
        responsive: true,
        maintainAspectRatio: false, // 🔧 Important pour que height fonctionne
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y1: {
                type: 'linear',
                position: 'left',
                min: 0,
                max: 100,
                title: {
                    display: true,
                    text: 'Pourcentage (%)',
                },
            },
            y2: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Tension (V)',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
        plugins: {
            zoom: {
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
        },
    };

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Line
                ref={chartRef}
                data={data}
                options={options}
            />
        </div>
    );
};

export default EnergyDualChartZoomable;
