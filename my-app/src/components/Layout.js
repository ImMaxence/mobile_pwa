import React from 'react';
import Header from './Header';
import Nav from './Nav';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <Header />
            <main className="layout-content">
                {children}
            </main>
            <Nav />
        </div>
    );
};

export default Layout;