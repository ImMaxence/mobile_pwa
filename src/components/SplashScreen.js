import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setFadeOut(true), 700); // Début de l'animation
        const timer2 = setTimeout(() => onFinish(), 1000);       // Fin du splash

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onFinish]);

    return (
        <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
            <img src="/logo512.png" alt="Logo" className="splash-logo" />
            {/* <p className="splash-text">Chargement...</p> */}
        </div>
    );
};

export default SplashScreen;
