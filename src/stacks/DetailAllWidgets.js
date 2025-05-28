import React, { useState, useEffect } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getAlerts, getDataDash } from '../services/hiveService';

import MapChart from '../components/charts/MapChart';
import EnergyDualChartZoomable from '../components/charts/EnergyDualChartZoomable';
import { Radio } from 'antd';
import HumidityChartZoomable from '../components/charts/HumidityChartZoomable';
import PressureChartZoomable from '../components/charts/PressureChartZoomable';
import TemperatureDualChartZoomable from '../components/charts/TemperatureDualChartZoomable';
import WeightChartZoomable from '../components/charts/WeightChartZoomable';
import EventPage from '../components/EventPage';

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
                        setNameWidget("Pression");
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
                    case 'event':

                        setNameWidget("Notifications ruches")
                        console.log(idHive)
                        const eventData = await getAlerts(idHive)
                        console.log(JSON.stringify(eventData))
                        setData(eventData)
                    default:
                        setNameWidget("Inconnu");
                        break;
                }
            } catch (err) {
                setError(err);
            }
        };

        fetchData();
    }, [trigger, histo, widgetType, idHive]);

    const periods = [
        { label: "Heure", value: 60 },
        { label: "Jour", value: 1440 },
        { label: "Semaine", value: 10080 },
        { label: "Mois", value: 43800 },
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
                                style={{ marginBottom: 40, width: "100%" }}
                            >
                                {periods.map(({ label, value }) => (
                                    <Radio.Button key={value} value={value}>
                                        {label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>

                    </div>
                    <WeightChartZoomable data={data} />
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
                    <TemperatureDualChartZoomable tempIntData={data.int} tempExtData={data.ext} />
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
                    <PressureChartZoomable data={data} />
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

            {widgetType === 'event' && data && (
                <>
                    <EventPage data={data} />
                </>
            )}

            {error && <p style={{ padding: "20px" }} className='error_lab'>{error}</p>}
        </LayoutStackNav>
    );
};

export default DetailAllWidgets;
