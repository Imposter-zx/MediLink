import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppShell from './AppShell';
import AppRoutes from './routes';
import { useAuthStore } from '../stores/authStore';
import { useFeatureFlag, FLAGS } from '../utils/featureFlags';
import { MedplumProvider } from '@medplum/react';
import { medplum } from '../lib/medplum';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// Lazy load Landing Scene
const LandingScene = lazy(() => import('../components/ThreeLanding/LandingScene'));

function App() {
  const { isAuthenticated, login, checkSession, isLoading } = useAuthStore();
  
  const isLandingEnabled = useFeatureFlag(FLAGS.LANDING_3D, true);
  
  useEffect(() => {
    checkSession();
  }, [checkSession]);
  
  const [showLanding, setShowLanding] = useState(() => {
    return localStorage.getItem('medilink_landing_seen') !== 'true';
  });

  const handleEnterApp = () => {
    login({ 
      userData: { id: 'user-1', name: 'Ilyass', role: 'patient' } 
    });
    localStorage.setItem('medilink_landing_seen', 'true');
    setShowLanding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent 
        isLandingEnabled={isLandingEnabled} 
        showLanding={showLanding} 
        isAuthenticated={isAuthenticated} 
        onEnterApp={handleEnterApp} 
      />
    </Router>
  );
}

/**
 * Secondary component to use hooks like useLocation
 */
function AppContent({ isLandingEnabled, showLanding, isAuthenticated, onEnterApp }) {
  const location = useLocation();
  
  /**
   * Only show landing if:
   * 1. It's enabled
   * 2. User hasn't seen it (or it's explicitly shown)
   * 3. User is NOT authenticated
   * 4. User is on the ROOT path '/'
   */
  const shouldShowLanding = 
    isLandingEnabled && 
    showLanding && 
    !isAuthenticated && 
    (location.pathname === '/' || location.pathname === '');

  if (shouldShowLanding) {
    return (
      <Suspense fallback={
        <div className="bg-slate-950 w-full h-screen flex flex-col items-center justify-center text-primary gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium tracking-widest uppercase text-xs opacity-50">Initializing Environment</span>
        </div>
      }>
        <LandingScene onEnter={onEnterApp} />
      </Suspense>
    );
  }

  return (
    <MedplumProvider medplum={medplum}>
      <MantineProvider>
        <Notifications position="bottom-right" />
        <AppShell>
          <AppRoutes />
        </AppShell>
      </MantineProvider>
    </MedplumProvider>
  );
}

export default App;
