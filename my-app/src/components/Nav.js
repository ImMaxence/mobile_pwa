import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {

    return (
        <div className="layout-navbar">
            <div className='nav-buttons'>
                <Link to="/qrcode">Qrcode</Link>
                <Link to="/alert">Alert</Link>
                <Link to="/">Home</Link>
                <Link to="/map">Map</Link>
                <Link to="/user">User</Link>
            </div>
        </div>
    );
};

export default Nav;