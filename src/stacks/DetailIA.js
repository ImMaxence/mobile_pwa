import React from 'react';
import LayoutStackNav from '../components/LayoutStackNav';

const DetailIA = () => {
    return (
        <LayoutStackNav back_name={localStorage.getItem('currentHiveName')} back_url={'/detail/hive'}>
            <p>IA PAGE OMG</p>
        </LayoutStackNav>
    );
};

export default DetailIA;