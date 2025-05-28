// src/components/NetworkStatusBanner.js
import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';

const NetworkStatusBanner = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const updateNetworkStatus = () => {
        setIsOnline(navigator.onLine);
    };

    useEffect(() => {
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        return () => {
            window.removeEventListener('online', updateNetworkStatus);
            window.removeEventListener('offline', updateNetworkStatus);
        };
    }, []);

    if (isOnline) return null;

    return (
        <Alert
            message="Connexion perdue"
            description="Vous êtes hors ligne. Certaines fonctionnalités peuvent ne pas fonctionner."
            type="warning"
            showIcon
            banner
            closable
        />
    );
};

export default NetworkStatusBanner;