import React, { useState, useEffect } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { useNavigate } from 'react-router-dom';

const DetailHive = () => {

    const navigate = useNavigate()

    return (
        <LayoutStackNav back_name={localStorage.getItem('currentGroupName')} back_url={'/detail/group'}>
            <h3>{localStorage.getItem('currentHiveName')} - setting</h3>
            <div>
                <button onClick={() => navigate('/detail/hive/info')}>Informations ruche</button>
                <button onClick={() => navigate('/detail/hive/EN-ATTENTE')}>Comptage varroas</button>
                <button onClick={() => navigate('/detail/hive/report-create')}>Rapport ruche</button>
                <button onClick={() => navigate('/detail/hive/report-histo')}>Historique des rapports</button>
            </div>
            <div>
                <button onClick={() => {
                    localStorage.setItem('currentWidgetType', 'map')
                    navigate('/detail/hive/widget')
                }}>map</button>
                <button onClick={() => {
                    localStorage.setItem('currentWidgetType', 'energy')
                    navigate('/detail/hive/widget')
                }}>energy</button>
                <button onClick={() => {
                    localStorage.setItem('currentWidgetType', 'poids')
                    navigate('/detail/hive/widget')
                }}>poids</button>
                <button onClick={() => {
                    localStorage.setItem('currentWidgetType', 'event')
                    navigate('/detail/hive/widget')
                }}>event</button>
                <button onClick={() => {
                    localStorage.setItem('currentWidgetType', 'temperature')
                    navigate('/detail/hive/widget')
                }}>temperature</button>
                <button onClick={() => {
                    localStorage.setItem('currentWidgetType', 'pression')
                    navigate('/detail/hive/widget')
                }}>pression</button>
                <button onClick={() => {
                    localStorage.setItem('currentWidgetType', 'humidity')
                    navigate('/detail/hive/widget')
                }}>humidity</button>

            </div>
        </LayoutStackNav>
    );
};

export default DetailHive;