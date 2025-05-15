import { useEffect, useState } from 'react';
import Tutorial from './components/Tutorial';

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
    <Tutorial />
  );
}

const MainApp = () => {
  return (
    <div>
      <h1>Main App</h1>
      <p>This is the main app content.</p>
    </div>
  );
}
export default App;
