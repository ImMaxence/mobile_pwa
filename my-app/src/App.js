import { useEffect, useState } from 'react';
import Tutorial from './components/Tutorial';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Qrcode from './pages/Qrcode';
import User from './pages/User';
import Nav from './components/Nav';
import Alert from './pages/Alert';
import Map from './pages/Map';

const App = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);
  }, []);

  return isStandalone ? (
    <MainApp />
  ) : (
    // <Tutorial />
    <MainApp />
  );
}

const MainApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/qrcode" element={<Qrcode />} />
        <Route path="/user" element={<User />} />
        <Route path="/alert" element={<Alert />} />
        <Route path="/map" element={<Map />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Nav />
    </BrowserRouter>
  );
}
export default App;
