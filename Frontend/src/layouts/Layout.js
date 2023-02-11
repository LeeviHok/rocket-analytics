import { Routes, Route } from 'react-router-dom';

import MainLayout from './MainLayout';
import Home from '../pages/Home';
import FlightAnalytics from '../pages/FlightAnalytics';
import ThrustAnalytics from '../pages/ThrustAnalytics';

function Layout() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="flight-analytics" element={<FlightAnalytics />} />
        <Route path="thrust-analytics" element={<ThrustAnalytics />} />
      </Route>
    </Routes>
  );
}

export default Layout;
