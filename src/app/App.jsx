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

// Lazy load Medical Landing Page
const MedicalLanding = lazy(() => import('../components/MedicalLanding/MedicalLanding'));

function App() {
  const { isAuthenticated, login, checkSession, isLoading } = useAuthStore();
  
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent 
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
function AppContent({ showLanding, isAuthenticated, onEnterApp }) {
  const location = useLocation();
  
  /**
   * Only show landing if:
   * 1. User hasn't seen it (or it's explicitly shown)
   * 2. User is NOT authenticated
   * 3. User is on the ROOT path '/'
   */
  const shouldShowLanding = 
    showLanding && 
    !isAuthenticated && 
    (location.pathname === '/' || location.pathname === '');

  if (shouldShowLanding) {
    return (
      <Suspense fallback={
        <div className="bg-background w-full h-screen flex flex-col items-center justify-center text-primary gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium tracking-widest uppercase text-xs text-muted-foreground">Loading Secure Environment</span>
        </div>
      }>
        <MedicalLanding onEnter={onEnterApp} />
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
