import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const PharmacyDashboard = lazy(() => import('./pages/PharmacyDashboard'));
const DeliveryDashboard = lazy(() => import('./pages/DeliveryDashboard'));
const Medications = lazy(() => import('./pages/Medications'));

// Lazy load Landing Scene to avoid blocking initial bundle
const LandingScene = lazy(() => import('./components/ThreeLanding/LandingScene'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
  </div>
);

function App() {
  // Check if user has visited before
  const [visited, setVisited] = useState(() => {
    // DEBUG: Allow resetting via URL ?reset=true
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'true') {
      localStorage.removeItem('medilink_visited');
      return false;
    }
    return localStorage.getItem('medilink_visited') === 'true';
  });

  const handleEnterApp = () => {
    localStorage.setItem('medilink_visited', 'true');
    setVisited(true);
  };

  // If not visited, show Landing Gateway
  if (!visited) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="bg-black w-full h-screen flex items-center justify-center text-cyan-500">Loading Experience...</div>}>
          <LandingScene onEnter={handleEnterApp} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <main>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/patient" element={<PatientDashboard />} />
                <Route path="/medications" element={<Medications />} />
                <Route path="/pharmacy" element={<PharmacyDashboard />} />
                <Route path="/delivery" element={<DeliveryDashboard />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
