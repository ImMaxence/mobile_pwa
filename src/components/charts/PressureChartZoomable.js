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
import { max, min } from 'date-fns';

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

const formatChartData = (pressureData) => {
    if (!pressureData || pressureData.length === 0) return { labels: [], datasets: [] };

    const sorted = pressureData
        .map(d => ({
            date: new Date(d.date_collecte_donnee),
            pressure: d.valeur,
        }))
        .sort((a, b) => a.date - b.date);

    return {
        labels: sorted.map(d => d.date),
        datasets: [
            {
                label: 'Pression externe (hPa)',
                data: sorted.map(d => d.pressure),
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

const PressureChartZoomable = ({ data }) => {
    const chartRef = useRef();
    const chartData = formatChartData(data);

    if (!data || data.length === 0) return <p style={{ padding: "20px" }}>Aucune donnée disponible</p>;

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
                // min: 900,
                // max: 1000,
                title: {
                    display: true,
                    text: 'Pression (hPa)',
                },
            },
        },
        plugins: {
            zoom: {
                limits: {
                    y: { min: 'original', max: 'original' }, // axe Y auto mais fixe pendant zoom
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
        <div style={{ width: '100%', height: '500px' }}>
            <Line ref={chartRef} data={chartData} options={options} />
        </div>
    );
};

export default PressureChartZoomable;
