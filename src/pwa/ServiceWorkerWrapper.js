// src/pwa/ServiceWorkerWrapper.js
import { useEffect } from 'react';
import { notification, Button } from 'antd';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

const ServiceWorkerWrapper = () => {
    useEffect(() => {
        const showUpdateNotification = (registration) => {
            const key = 'update-notification';

            const reloadPage = () => {
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    registration.waiting.addEventListener('statechange', (e) => {
                        if (e.target.state === 'activated') {
                            window.location.reload();
                        }
                    });
                }
                notification.close(key);
            };

            notification.open({
                key,
                message: 'Mise à jour disponible',
                description: 'Une nouvelle version de l’application est disponible.',
                btn: (
                    <Button type="primary" size="small" onClick={reloadPage}>
                        Mettre à jour maintenant
                    </Button>
                ),
                duration: 0,
                placement: 'bottomRight',
            });
        };

        const showCachedNotification = () => {
            notification.success({
                message: 'App prête',
                description: 'L’application est désormais disponible hors ligne.',
                placement: 'bottomRight',
                duration: 4,
            });
        };

        serviceWorkerRegistration.register({
            onUpdate: showUpdateNotification,
            onSuccess: showCachedNotification,
        });
    }, []);

    return null;
};

export default ServiceWorkerWrapper;