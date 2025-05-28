import React from 'react';
import { useNavigate } from 'react-router-dom';
import NetworkStatusBanner from './NetworkStatusBanner';
import { FaArrowLeft } from "react-icons/fa";
import AnimatedPage from './AnimatedPage';

const LayoutStackNav = ({ children, back_url = '/', back_name = 'Retour' }) => {
    const navigate = useNavigate();

    const handleBack = () => {

        navigate(back_url);


    };

    return (
        <div className="layout-container">
            <header className="layout-header-stack">
                <button className='stack_btn' onClick={handleBack}>
                    <FaArrowLeft />
                    {back_name}
                </button>
            </header>
            <NetworkStatusBanner />
            <main className="layout-content">
                <AnimatedPage>
                    {children}
                </AnimatedPage>
            </main>
        </div>
    );
};

export default LayoutStackNav;
