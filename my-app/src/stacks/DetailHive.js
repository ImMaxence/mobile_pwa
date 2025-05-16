import React, { useState, useEffect } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';

const DetailHive = () => {
    return (
        <LayoutStackNav back_name={localStorage.getItem('currentHiveName')} back_url={'/detail/group'}>

        </LayoutStackNav>
    );
};

export default DetailHive;