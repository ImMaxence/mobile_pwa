import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NetworkStatusBanner from './NetworkStatusBanner';
import { FaArrowLeft } from "react-icons/fa";

const LayoutStackNav = ({ children, back_url, back_name }) => {
    const navigate = useNavigate();

    return (
        // <div>
        //     <div className='lay_sta_back'>
        //         <button onClick={() => { navigate(`${back_url}`) }}>{back_name} (retour stack)</button>
        //     </div>
        //     <div>
        //         <NetworkStatusBanner />
        //         {children}
        //     </div>

        // </div>

        <div className="layout-container">
            <header className="layout-header-stack">
                <button className='stack_btn' onClick={() => { navigate(`${back_url}`) }}>
                    <FaArrowLeft />
                    {back_name}
                </button>
            </header>
            <NetworkStatusBanner />
            <main className="layout-content">
                {children}
            </main>
        </div>
    );
};

export default LayoutStackNav;
