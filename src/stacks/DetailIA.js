import React, { useEffect, useState } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getInfoIA } from '../services/iaService';
import { Progress } from 'antd';

const DetailIA = () => {

    const [essaimage, setEssaimage] = useState([])
    const [mielle, setMielle] = useState([])
    const [prediction, setPrediction] = useState([])


    const [error, setError] = useState(null)
    const [loader, setLoader] = useState(true)
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        setLoader(true)
        let intervalId;
        let timeoutId;

        const fetchInfo = async () => {
            try {
                const lat = localStorage.getItem('currentHiveLatitude');
                const long = localStorage.getItem('currentHiveLongitude');
                const id = localStorage.getItem('currentHiveId');

                intervalId = setInterval(() => {
                    setPercent((oldPercent) => {
                        if (oldPercent >= 50) {
                            clearInterval(intervalId); // Stoppe ici l'interval dès 50%
                            return 50;
                        }
                        return oldPercent + 2;
                    });
                }, 200);

                const res = await getInfoIA(lat, long, id);
                console.log("DONE ✅");
                console.log(res)
                setEssaimage(res.data.essaimage);
                setPrediction(res.data.prediction)
                setMielle(res.data.mielle)

                // S’assure que l’interval est stoppé avant de passer à 100%
                clearInterval(intervalId);

                // Délai court pour s'assurer que le 50% est affiché avant le 100%
                setTimeout(() => {
                    setPercent(100);

                    // Timeout pour garder le loader 100% visible un moment
                    timeoutId = setTimeout(() => {
                        setLoader(false);
                    }, 1500);
                }, 100);

            } catch (err) {
                clearInterval(intervalId);
                setPercent(100);
                setLoader(false);
                setError(err);
            }
        };

        // Petit délai avant le fetch
        const startTimeout = setTimeout(() => {
            fetchInfo();
        }, 650);

        // Cleanup
        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            clearTimeout(startTimeout);
        };
    }, []);


    return (
        <LayoutStackNav back_name={localStorage.getItem('currentHiveName')} back_url={'/detail/hive'}>
            <div style={{ padding: "20px" }}>


                {
                    loader ? (
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <Progress percent={percent} type="circle" />
                        </div>

                    ) : error ? (
                        <p className='error_lab'>{error}</p>
                    ) : (
                        <>
                            <h2>Informations sur l'essaimage</h2>
                            <p><strong>Période floraison :</strong> {essaimage?.period_flower}</p>
                            <p><strong>Prévisions précipitations (3 jours) :</strong> {essaimage?.precipitation_forecast_3d} mm</p>
                            <p><strong>Reine présente ?</strong> {essaimage?.queen_cell_present ? "Oui" : "Non"}</p>
                            <p><strong>Vitesse vent (3 jours) :</strong> {essaimage?.wind_speed_forecast_3d} km/h</p>

                            <h2>Informations sur le miel</h2>
                            <p><strong>Nombre de fleurs détectées :</strong> {mielle?.nb_flower_found}</p>
                            <p><strong>Précipitations des 30 derniers jours :</strong> {mielle?.sum_precipitation_mm_last_30d} mm</p>

                            <h3>Top 5 fleurs détectées :</h3>
                            <ul>
                                {mielle?.top_5?.map((flower, index) => (
                                    <li key={index}>
                                        {flower.name_fr} - {flower.occurences} occurrences
                                    </li>
                                ))}
                            </ul>

                            <h3>Répartition annuelle (mois - nombre de fleurs)</h3>
                            <ul>
                                {mielle?.period && Object.entries(mielle.period).map(([month, count]) => (
                                    <li key={month}>Mois {month} : {count} fleurs</li>
                                ))}
                            </ul>

                            <h2>Prédictions IA</h2>
                            <p><strong>Essaimage prédit ?</strong> {prediction?.status_essaimage ? "Oui" : "Non"}</p>
                            <p><strong>Mellifère prédit ?</strong> {prediction?.status_mielle}</p>
                        </>

                    )
                }
                <p className='error_lab'>{error}</p>
            </div>
        </LayoutStackNav>
    );
};

export default DetailIA;