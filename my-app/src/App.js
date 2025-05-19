import { useEffect, useState } from 'react';
import Tutorial from './components/Tutorial';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Qrcode from './pages/Qrcode';
import User from './pages/User';
import Alert from './pages/Alert';
import Map from './pages/Map';
import DetailGroup from './stacks/DetailGroup';
import DetailHive from './stacks/DetailHive';
import DetailInfoHive from './stacks/DetailInfoHive';
import DetailReportCreate from './stacks/DetailReportCreate';
import DetailReportHisto from './stacks/DetailReportHisto';
import DetailAllWidgets from './stacks/DetailAllWidgets';
import ServiceWorkerWrapper from './pwa/ServiceWorkerWrapper';
import SplashScreen from './components/SplashScreen';

const App = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      setIsStandalone(standalone);
    };

    checkStandalone();
    window.addEventListener('visibilitychange', checkStandalone); // Au cas où l'user installe en cours
    return () => {
      window.removeEventListener('visibilitychange', checkStandalone);
    };
  }, []);

  return (
    <>
      <ServiceWorkerWrapper />
      {loading ? (
        <SplashScreen onFinish={() => setLoading(false)} />
      ) : isStandalone ? (
        <MainApp />
      ) : (
        <Tutorial />
      )}
    </>
  );
};

const MainApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/qrcode" element={<Qrcode />} />
        <Route path="/user" element={<User />} />
        <Route path="/alert" element={<Alert />} />
        <Route path="/map" element={<Map />} />
        <Route path="/detail/group" element={<DetailGroup />} />
        <Route path="/detail/hive" element={<DetailHive />} />
        <Route path="/detail/hive/info" element={<DetailInfoHive />} />
        <Route path="/detail/hive/report-create" element={<DetailReportCreate />} />
        <Route path="/detail/hive/report-histo" element={<DetailReportHisto />} />
        <Route path="/detail/hive/widget" element={<DetailAllWidgets />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
