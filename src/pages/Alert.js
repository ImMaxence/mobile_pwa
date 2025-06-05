import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getAlerts } from '../services/hiveService';
import { Skeleton } from 'antd';
import { Collapse } from 'antd';
const { Panel } = Collapse;

// Couleurs associées à chaque type d'alerte
const alertColors = {
    "Chute": "#f87171",
    "Frelons": "#fbbf24",
    "Température extrêmement haute": "#f97316",
    "Température haute": "#fb923c",
    "Température extrêmement basse": "#60a5fa",
    "Température basse": "#93c5fd",
    "Humidité extrêmement haute": "#38bdf8",
    "Humidité haute": "#7dd3fc",
    "Humidité extrêmement basse": "#a5b4fc",
    "Humidité basse": "#c4b5fd"
};

const AlertCard = ({ alerte }) => {
    const { typeAlerte, createdAt } = alerte;
    const color = alertColors[typeAlerte.type_alerte] || "#e5e7eb";

    return (
        <div className='just_sha' style={{
            borderLeft: `6px solid ${color}`,
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px"
        }}>
            <h4 style={{ margin: "0 0 8px", color }}>{typeAlerte.titre}</h4>
            <p style={{ margin: 0 }}>{typeAlerte.message}</p>
            <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "8px" }}>
                {new Date(createdAt).toLocaleString()}
            </p>
        </div>
    );
};

const Alert = () => {
    const [data, setData] = useState([]);
    const [ruches, setRuches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const local = localStorage.getItem('ruches_localisees');

            if (!local) {
                setRuches([]);
                setLoading(false);
                return;
            }

            const ruchesParsed = JSON.parse(local);
            setRuches(ruchesParsed);

            console.log("✅🌺🔔✅🌺🔔✅🌺🔔✅🌺🔔")
            console.log(ruchesParsed)

            try {
                const allAlerts = [];
                for (let ruche of ruchesParsed) {
                    try {
                        const alerts = await getAlerts(ruche.id);
                        allAlerts.push({ ruche, alerts });
                    } catch (err) {
                        if (err.response && err.response.status === 404) {
                            allAlerts.push({ ruche, alerts: [] }); // Aucune alerte, mais pas une erreur bloquante
                        } else {
                            console.log(err)
                        }
                    }
                }

                setData(allAlerts);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };


        setTimeout(() => {
            fetchData();
        }, 650)
    }, []);

    return (
        <Layout>
            <div style={{ padding: 20, width: "100%" }}>
                {/* <h2 style={{ textAlign: 'center', marginBottom: 24 }}>📢 Alertes des ruches</h2> */}

                {loading ? (
                    <Skeleton active />
                ) : ruches.length === 0 ? (
                    <div>
                        <p>
                            Veuillez vous connecter et ajouter votre ruche dans <strong>"Mes Groupes"</strong> avant de la voir sur la carte.
                        </p>
                    </div>
                ) : error ? (
                    <p className=''>{error}</p>
                ) : (
                    <Collapse accordion>
                        {data.map(({ ruche, alerts }) => (
                            <Panel header={ruche.nom} key={ruche.id}>
                                {alerts.length > 0 ? (
                                    alerts
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .map(alert => (
                                            <AlertCard key={alert.id} alerte={alert} />
                                        ))
                                ) : (
                                    <p style={{ color: "#6b7280" }}>Aucune alerte pour cette ruche.</p>
                                )}
                            </Panel>
                        ))}
                    </Collapse>
                )}
            </div>
        </Layout>
    );
};

export default Alert;
