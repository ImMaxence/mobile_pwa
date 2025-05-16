import React, { useState, useEffect } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getDataDash } from '../services/hiveService';

const DetailAllWidgets = () => {

    const [histo, setHisto] = useState(1440) // 1 jour en minutes
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [trigger, setTrigger] = useState(false)
    const [nameWidget, setNameWidget] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null)
                const idHive = localStorage.getItem('currentHiveId')
                switch (localStorage.getItem('currentWidgetType')) {
                    case 'map':
                        setNameWidget("Carte")
                        break
                    case 'energy':
                        setNameWidget("Energie")
                        const res1 = await getDataDash(histo, {
                            type: "POURCENTAGE_BATTERIE",
                            id_ruche: idHive
                        })
                        setData(res1)
                        break
                    case 'poids':
                        setNameWidget("Poids")
                        const res2 = await getDataDash(histo, {
                            type: "WEIGHT",
                            id_ruche: idHive
                        })
                        setData(res2)
                        break
                    case 'event':
                        setNameWidget("Evenements")
                        break
                    case 'tempint':
                        setNameWidget("Température intérieur")
                        const res3 = await getDataDash(histo, {
                            type: "TEMPERATURE_INT",
                            id_ruche: idHive
                        })
                        setData(res3)
                        break
                    case 'tempext':
                        setNameWidget("Température extérieur")
                        const res4 = await getDataDash(histo, {
                            type: "TEMPERATURE_EXT",
                            id_ruche: idHive
                        })
                        setData(res4)
                        break
                    case 'pression':
                        setNameWidget("Préssion")
                        const res5 = await getDataDash(histo, {
                            type: "PRESSURE_EXT",
                            id_ruche: idHive
                        })
                        setData(res5)
                        break
                    case 'humint':
                        setNameWidget("Humidité intérieur")
                        const res6 = await getDataDash(histo, {
                            type: "HUMIDITY_INT",
                            id_ruche: idHive
                        })
                        setData(res6)
                        break
                    case 'humext':
                        setNameWidget("Humidité extérieur")
                        const res7 = await getDataDash(histo, {
                            type: "HUMIDITY_EXT",
                            id_ruche: idHive
                        })
                        setData(res7)
                        break
                }
                console.log(data)
            } catch (err) {
                setError(err)
            }
        }

        fetchData()
    }, [trigger])

    const periods = [
        { label: "1 heure", value: 60 },
        { label: "1 jour", value: 1440 },
        { label: "1 semaine", value: 10080 },
        { label: "1 mois", value: 43800 },
    ];


    return (
        <LayoutStackNav back_name={'Retour'} back_url={'/detail/hive'}>
            <h2>{nameWidget}</h2>
            <div>
                {periods.map(({ label, value }) => (
                    <label key={value}>
                        <input
                            type="radio"
                            name="his"
                            value={value}
                            checked={histo === value}
                            onChange={() => {
                                setHisto(value)
                                setTrigger(!trigger)
                            }}
                        />
                        {label}
                    </label>
                ))}
            </div>

            {
                localStorage.getItem('currentWidgetType') === 'map' ? (
                    <>content map</>
                ) : localStorage.getItem('currentWidgetType') === 'energy' ? (
                    <>content energy</>
                ) : localStorage.getItem('currentWidgetType') === 'poids' ? (
                    <></>
                ) : localStorage.getItem('currentWidgetType') === 'event' ? (
                    <></>
                ) : localStorage.getItem('currentWidgetType') === 'tempint' ? (
                    <></>
                ) : localStorage.getItem('currentWidgetType') === 'tempext' ? (
                    <></>
                ) : localStorage.getItem('currentWidgetType') === 'pression' ? (
                    <></>
                ) : localStorage.getItem('currentWidgetType') === 'humint' ? (
                    <></>
                ) : localStorage.getItem('currentWidgetType') === 'humext' ? (
                    <></>
                ) : (
                    <>no data avaible</>
                )
            }

            {error && <p>{error}</p>}

        </LayoutStackNav>
    );
};

export default DetailAllWidgets;