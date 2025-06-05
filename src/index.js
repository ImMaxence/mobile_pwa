import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'leaflet/dist/leaflet.css';
import { ConfigProvider } from 'antd';
import frFR from 'antd/locale/fr_FR';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider
    locale={frFR}
    theme={{
      "token": {
        "colorPrimary": "#FFCE10",
      },
      "components": {
        "Progress": {
          "defaultColor": "rgb(255,206,16)"
        }
      }
    }}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ConfigProvider>
);

serviceWorkerRegistration.register();