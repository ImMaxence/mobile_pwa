import React, { useEffect, useState } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getInfoIA, getNumberBees } from '../services/iaService';
import { Progress, Divider } from 'antd';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DetailIA = () => {
    const [essaimage, setEssaimage] = useState([]);
    const [mielle, setMielle] = useState([]);
    const [prediction, setPrediction] = useState([]);
    const [bees, setBees] = useState([]);

    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(true);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        setLoader(true);
        let intervalId;
        let timeoutId;

        const fetchInfo = async () => {
            try {
                const lat = localStorage.getItem('currentHiveLatitude');
                const long = localStorage.getItem('currentHiveLongitude');
                const id = localStorage.getItem('currentHiveId');

                intervalId = setInterval(() => {
                    setPercent(old => {
                        if (old >= 95) {
                            clearInterval(intervalId);
                            return 95;
                        }
                        return old + 2;
                    });
                }, 200);

                const res = await getInfoIA(lat, long, id);
                setEssaimage(res.data.essaimage);
                setPrediction(res.data.prediction);
                setMielle(res.data.mielle);

                const res2 = await getNumberBees(id);
                setBees(res2.data.nombre_abeille);

                clearInterval(intervalId);
                setTimeout(() => {
                    setPercent(100);
                    timeoutId = setTimeout(() => {
                        setLoader(false);
                    }, 1500);
                }, 100);
            } catch (err) {
                clearInterval(intervalId);
                setPercent(100);
                setLoader(false);
                setError(err.message || "Une erreur est survenue.");
            }
        };

        const startTimeout = setTimeout(() => {
            fetchInfo();
        }, 650);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            clearTimeout(startTimeout);
        };
    }, []);

    // Préparation du chart
    const mielleChartData = mielle?.period
        ? {
            labels: Object.keys(mielle.period).map(mois => `M${mois}`),
            datasets: [
                {
                    label: 'Nombre de fleurs',
                    data: Object.values(mielle.period),
                    backgroundColor: '#facc15'
                }
            ]
        }
        : null;

    const mielleChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Répartition des fleurs par mois'
            }
        }
    };

    return (
        <LayoutStackNav back_name={localStorage.getItem('currentHiveName')} back_url={'/detail/hive'}>
            <div style={{ padding: "20px" }}>
                {loader ? (
                    <div style={{ width: "100%", textAlign: "center" }}>
                        <Progress percent={percent} type="circle" />
                        <p style={{ marginTop: "10px" }}>Analyse des données IA en cours...</p>
                    </div>
                ) : error ? (
                    <p className='error_lab'>{error}</p>
                ) : (
                    <>
                        <Divider orientation="left">🧠 Essaimage</Divider>
                        <p><strong>Période floraison :</strong> {essaimage?.period_flower}</p>
                        <p><strong>Prévisions précipitations (3 jours) :</strong> {essaimage?.precipitation_forecast_3d} mm</p>
                        <p><strong>Reine présente ?</strong> {essaimage?.queen_cell_present ? "Oui" : "Non"}</p>
                        <p><strong>Vitesse vent (3 jours) :</strong> {essaimage?.wind_speed_forecast_3d} km/h</p>

                        <Divider style={{ marginTop: "40px" }} orientation="left">🍯 Données sur le miel</Divider>
                        <p><strong>Nombre de fleurs détectées :</strong> {mielle?.nb_flower_found}</p>
                        <p><strong>Précipitations des 30 derniers jours :</strong> {mielle?.sum_precipitation_mm_last_30d} mm</p>

                        <h5 style={{ marginTop: "40px" }}>Top 5 fleurs détectées :</h5>
                        <ul>
                            {mielle?.top_5?.map((flower, index) => (
                                <p key={index}>
                                    {flower.name_fr} - {flower.occurences} occurrences
                                </p>
                            ))}
                        </ul>

                        <h5 style={{ marginTop: "40px" }}>Répartition annuelle</h5>
                        {mielleChartData ? (
                            <Bar data={mielleChartData} options={mielleChartOptions} />
                        ) : (
                            <p>Aucune donnée disponible pour la période annuelle.</p>
                        )}

                        <Divider style={{ marginTop: "40px" }} orientation="left">📊 Prédictions IA</Divider>
                        <p><strong>Essaimage prédit ?</strong> {prediction?.status_essaimage ? "Oui" : "Non"}</p>
                        <p><strong>Mellifère prédit ?</strong> {prediction?.status_mielle}</p>

                        <Divider style={{ marginTop: "40px" }} orientation="left">🐝 Population</Divider>
                        <p><strong>Nombre d'abeilles :</strong> {bees?.value}</p>
                    </>
                )}
            </div>
        </LayoutStackNav>
    );
};

export default DetailIA;
