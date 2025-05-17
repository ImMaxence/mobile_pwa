import React, { useEffect } from 'react';
import Header from './Header';
import Nav from './Nav';
import NetworkStatusBanner from '../components/NetworkStatusBanner'

const Layout = ({ children }) => {

    return (
        <div className="layout-container">
            <Header />
            <NetworkStatusBanner />
            <main className="layout-content">
                {children}
            </main>
            <Nav />
        </div>
    );
};

export default Layout;