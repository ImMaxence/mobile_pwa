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

const formatChartData = (data) => {
    const sortedData = data
        .map(d => ({
            date: new Date(d.date_collecte_donnee),
            weight: d.valeur,
        }))
        .sort((a, b) => a.date - b.date);

    return {
        labels: sortedData.map(d => d.date),
        datasets: [
            {
                label: 'Poids (kg)',
                data: sortedData.map(d => d.weight),
                borderColor: '#82ca9d',
                backgroundColor: 'rgba(130, 202, 157, 0.2)',
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2,
            },
        ],
    };
};

const WeightChartZoomable = ({ data }) => {
    const chartRef = useRef();

    if (!data || data.length === 0) return <p>Aucune donnée disponible</p>;

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
                    unit: 'day',
                    tooltipFormat: 'PPpp',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                type: 'linear',
                // min: 0,
                // auto,
                title: {
                    display: true,
                    text: 'Poids (kg)',
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
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <div>

            <div style={{ width: '100%', height: '500px' }}>
                <Line ref={chartRef} data={chartData} options={options} />
            </div>
        </div>
    );
};

export default WeightChartZoomable;
