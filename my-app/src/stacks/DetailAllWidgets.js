import React, { useState, useEffect } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getDataDash } from '../services/hiveService';

import TemperatureDualChart from '../components/charts/TemperatureDualChart';
import EnergyDualChart from '../components/charts/EnergyDualChart';
import WeightChart from '../components/charts/WeightChart';
import PressureChart from '../components/charts/PressureChart';
import HumidityDualChart from '../components/charts/HumidityDualChart';
import HumidityChart from '../components/charts/HumidityChart';
import MapChart from '../components/charts/MapChart';
import EnergyDualChartZoomable from '../components/charts/EnergyDualChartZoomable';
import { Radio } from 'antd';
import HumidityChartZoomable from '../components/charts/HumidityChartZoomable';

const DetailAllWidgets = () => {
    const [histo, setHisto] = useState(1440); // 1 jour en minutes
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [trigger, setTrigger] = useState(false);
    const [nameWidget, setNameWidget] = useState("");

    const widgetType = localStorage.getItem('currentWidgetType');
    const idHive = localStorage.getItem('currentHiveId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                switch (widgetType) {
                    case 'poids':
                        setNameWidget("Poids");
                        const poidsData = await getDataDash(histo, {
                            type: "WEIGHT",
                            id_ruche: idHive
                        });
                        setData(poidsData);
                        break;
                    case 'energy':
                        setNameWidget("Énergie");
                        const batteryData = await getDataDash(histo, {
                            type: "POURCENTAGE_BATTERIE",
                            id_ruche: idHive
                        });
                        const tensionData = await getDataDash(histo, {
                            type: "TENSION_BATTERIE",
                            id_ruche: idHive
                        });
                        setData({ pourcentage: batteryData, tension: tensionData });
                        break;
                    case 'temperature':
                        setNameWidget("Température intérieure / extérieure");
                        const tempInt = await getDataDash(histo, {
                            type: "TEMPERATURE_INT",
                            id_ruche: idHive
                        });
                        const tempExt = await getDataDash(histo, {
                            type: "TEMPERATURE_EXT",
                            id_ruche: idHive
                        });
                        setData({ int: tempInt, ext: tempExt });
                        break;
                    case 'pression':
                        setNameWidget("Poids");
                        const pressionData = await getDataDash(histo, {
                            type: "PRESSURE_EXT",
                            id_ruche: idHive
                        });
                        setData(pressionData);
                        break;
                    case 'humidity':
                        setNameWidget("Humidité intérieure");
                        const humIntData = await getDataDash(histo, {
                            type: "HUMIDITY_INT",
                            id_ruche: idHive
                        });
                        setData(humIntData);
                        break;
                    default:
                        setNameWidget("Inconnu");
                        break;
                }
            } catch (err) {
                setError("Erreur lors du chargement des données.");
                console.error(err);
            }
        };

        fetchData();
    }, [trigger, histo, widgetType, idHive]);

    const periods = [
        { label: "1 heure", value: 60 },
        { label: "1 jour", value: 1440 },
        { label: "1 semaine", value: 10080 },
        { label: "1 mois", value: 43800 },
    ];

    const onChangePeriod = (e) => {
        setHisto(e.target.value);
        setTrigger(!trigger);
    };

    return (
        <LayoutStackNav back_name={'Retour'} back_url={'/detail/hive'}>
            {widgetType === 'poids' && (
                <>
                    <div style={{ padding: "20px" }}>
                        <h2>{nameWidget}</h2>
                        <div className='radio_ant_ch'>
                            <Radio.Group
                                onChange={onChangePeriod}
                                value={histo}
                                buttonStyle="solid"
                                style={{ marginBottom: 40 }}
                            >
                                {periods.map(({ label, value }) => (
                                    <Radio.Button key={value} value={value}>
                                        {label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>

                    </div>
                    <WeightChart data={data} />
                </>
            )}

            {widgetType === 'energy' && data?.pourcentage && data?.tension && (
                <>
                    <div style={{ padding: "20px" }}>
                        <h2>{nameWidget}</h2>
                        <div className='radio_ant_ch'>
                            <Radio.Group
                                onChange={onChangePeriod}
                                value={histo}
                                buttonStyle="solid"
                                style={{ marginBottom: 40 }}
                            >
                                {periods.map(({ label, value }) => (
                                    <Radio.Button key={value} value={value}>
                                        {label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>

                    </div>

                    <EnergyDualChartZoomable batteryData={data.pourcentage} voltageData={data.tension} />
                </>
            )}

            {widgetType === 'temperature' && data?.int && data?.ext && (
                <>
                    <div style={{ padding: "20px" }}>
                        <h2>{nameWidget}</h2>
                        <div className='radio_ant_ch'>
                            <Radio.Group
                                onChange={onChangePeriod}
                                value={histo}
                                buttonStyle="solid"
                                style={{ marginBottom: 40 }}
                            >
                                {periods.map(({ label, value }) => (
                                    <Radio.Button key={value} value={value}>
                                        {label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>

                    </div>
                    <TemperatureDualChart tempIntData={data.int} tempExtData={data.ext} />
                </>
            )}

            {widgetType === 'pression' && data && (
                <>
                    <div style={{ padding: "20px" }}>
                        <h2>{nameWidget}</h2>
                        <div className='radio_ant_ch'>
                            <Radio.Group
                                onChange={onChangePeriod}
                                value={histo}
                                buttonStyle="solid"
                                style={{ marginBottom: 40 }}
                            >
                                {periods.map(({ label, value }) => (
                                    <Radio.Button key={value} value={value}>
                                        {label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>

                    </div>
                    <PressureChart data={data} />
                </>
            )}

            {widgetType === 'humidity' && data && (
                <>
                    <div style={{ padding: "20px" }}>
                        <h2>{nameWidget}</h2>
                        <div className='radio_ant_ch'>
                            <Radio.Group
                                onChange={onChangePeriod}
                                value={histo}
                                buttonStyle="solid"
                                style={{ marginBottom: 40 }}
                            >
                                {periods.map(({ label, value }) => (
                                    <Radio.Button key={value} value={value}>
                                        {label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>

                    </div>
                    <HumidityChartZoomable data={data} />
                </>
            )}

            {widgetType === 'map' && (
                <MapChart />
            )}

            {error && <p className='error_lab'>{error}</p>}
        </LayoutStackNav>
    );
};

export default DetailAllWidgets;
