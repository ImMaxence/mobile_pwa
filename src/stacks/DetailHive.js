import React, { useState, useEffect } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { useNavigate } from 'react-router-dom';
import GalaxyButton from '../components/GalaxyButton';

const DetailHive = () => {

    const navigate = useNavigate()

    return (
        <LayoutStackNav back_name={localStorage.getItem('currentGroupName')} back_url={'/detail/group'}>
            <div style={{ padding: "20px" }}>

                <h4 style={{ padding: '20px 0 40px 0' }}>{localStorage.getItem('currentHiveName')}</h4>

                <div className='container_hive_detail_btn'>
                    <button className='general_btn' onClick={() => navigate('/detail/hive/info')}>Informations ruche</button>
                    <button className='general_btn' onClick={() => navigate('/detail/hive/EN-ATTENTE')}>Comptage varroas</button>
                    <button className='general_btn' onClick={() => navigate('/detail/hive/report-create')}>Rapport ruche</button>
                    <button className='general_btn' onClick={() => navigate('/detail/hive/report-histo')}>Historique rapports</button>
                </div>

                <div className='ia_container'>


                    <GalaxyButton text="🤖 IA" onClick={() => console.log('Clicked')} />


                </div>


                <div className='container_wid_hive'>
                    <button onClick={() => {
                        localStorage.setItem('currentWidgetType', 'map')
                        navigate('/detail/hive/widget')
                    }}>🛩️ Carte</button>
                    <button onClick={() => {
                        localStorage.setItem('currentWidgetType', 'energy')
                        navigate('/detail/hive/widget')
                    }}>⚡️ Batterie</button>
                    <button onClick={() => {
                        localStorage.setItem('currentWidgetType', 'poids')
                        navigate('/detail/hive/widget')
                    }}>⚖️ Poids</button>
                    <button onClick={() => {
                        localStorage.setItem('currentWidgetType', 'event')
                        navigate('/detail/hive/widget')
                    }}>🔔 Evenements</button>
                    <button onClick={() => {
                        localStorage.setItem('currentWidgetType', 'temperature')
                        navigate('/detail/hive/widget')
                    }}>🔥 Température</button>
                    <button onClick={() => {
                        localStorage.setItem('currentWidgetType', 'pression')
                        navigate('/detail/hive/widget')
                    }}>☁️ Pression</button>
                    <button onClick={() => {
                        localStorage.setItem('currentWidgetType', 'humidity')
                        navigate('/detail/hive/widget')
                    }}>💦 Humidité</button>

                </div>
            </div>
        </LayoutStackNav >
    );
};

export default DetailHive;