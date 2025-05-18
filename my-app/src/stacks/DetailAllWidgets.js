import React, { useState, useEffect } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getDataDash } from '../services/hiveService';

import TemperatureDualChart from '../components/charts/TemperatureDualChart';
import EnergyDualChart from '../components/charts/EnergyDualChart';
import WeightChart from '../components/charts/WeightChart';
import PressureChart from '../components/charts/PressureChart';
import HumidityDualChart from '../components/charts/HumidityDualChart';
import HumidityChart from '../components/charts/HumidityChart';

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
                        console.log(poidsData)
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
                        console.log(pressionData)
                        setData(pressionData);
                        break
                    case 'humidity':
                        setNameWidget("Humidité intérieure");
                        const humIntData = await getDataDash(histo, {
                            type: "HUMIDITY_INT",
                            id_ruche: idHive
                        });
                        setData(humIntData);
                        break
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
    }, [trigger, histo]);

    const periods = [
        { label: "1 heure", value: 60 },
        { label: "1 jour", value: 1440 },
        { label: "1 semaine", value: 10080 },
        { label: "1 mois", value: 43800 },
    ];

    return (
        <LayoutStackNav back_name={'Retour'} back_url={'/detail/hive'}>
            <h2 className="text-xl font-bold mb-4">{nameWidget}</h2>

            <div className="flex gap-4 mb-4">
                {periods.map(({ label, value }) => (
                    <label key={value} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="his"
                            value={value}
                            checked={histo === value}
                            onChange={() => {
                                setHisto(value);
                                setTrigger(!trigger);
                            }}
                        />
                        {label}
                    </label>
                ))}
            </div>

            {widgetType === 'poids' && (
                <WeightChart data={data} />
            )}

            {widgetType === 'energy' && data?.pourcentage && data?.tension && (
                <EnergyDualChart batteryData={data.pourcentage} voltageData={data.tension} />
            )}

            {widgetType === 'temperature' && data?.int && data?.ext && (
                <TemperatureDualChart tempIntData={data.int} tempExtData={data.ext} />
            )}

            {widgetType === 'pression' && data && (
                <PressureChart data={data} />
            )}

            {widgetType === 'humidity' && data && (
                <HumidityChart data={data} />
            )}

            {error && <p className='error_lab'>{error}</p>}
        </LayoutStackNav>
    );
};

export default DetailAllWidgets;
