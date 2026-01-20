import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

import PatientDashboard from './pages/PatientDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Medications from './pages/Medications';

// const PatientPortal = () => <div className="p-8 text-2xl font-bold text-slate-800">Patient Dashboard</div>;
// const PharmacyPortal = () => <div className="p-8 text-2xl font-bold text-slate-800">Pharmacy Dashboard</div>;
// const DeliveryPortal = () => <div className="p-8 text-2xl font-bold text-slate-800">Delivery Dashboard</div>;

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/pharmacy" element={<PharmacyDashboard />} />
              <Route path="/delivery" element={<DeliveryDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
