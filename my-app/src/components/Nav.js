import React from 'react';
import { useNavigate } from 'react-router-dom';

const Nav = () => {

    const navigate = useNavigate();

    return (
        <div className="layout-navbar">
            <div className='nav-buttons'>
                <button onClick={() => navigate('/qrcode')}>Qrcode</button>
                <button onClick={() => navigate('/alert')}>Alerte</button>
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/map')}>Map</button>
                <button onClick={() => navigate('/user')}>User</button>
            </div>
        </div>
    );
};

export default Nav;