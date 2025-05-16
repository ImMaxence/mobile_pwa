import React from 'react';
import { useNavigate } from 'react-router-dom';

const LayoutStackNav = ({ children, back_url, back_name }) => {

    const navigate = useNavigate();

    return (
        <div>
            <div>
                <button onClick={() => { navigate(`${back_url}`) }}>{back_name} (retour stack)</button>
            </div>
            {children}
        </div>
    );
};

export default LayoutStackNav;