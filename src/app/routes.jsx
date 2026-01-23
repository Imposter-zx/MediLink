import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));
const PatientDashboard = lazy(() => import('../pages/PatientDashboard'));
const PharmacyDashboard = lazy(() => import('../pages/PharmacyDashboard'));
const DeliveryDashboard = lazy(() => import('../pages/DeliveryDashboard'));
const MedicationLibrary = lazy(() => import('../pages/MedicationLibrary'));
const Medications = lazy(() => import('../pages/Medications'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

/**
 * ProtectedRoute: Implements RBAC (Role-Based Access Control)
 * Ensures only authorized roles can access specific dashboards.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Protected Patient Routes */}
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/medications" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Medications />
          </ProtectedRoute>
        } />
        
        {/* Protected Pharmacy Routes */}
        <Route path="/pharmacy" element={
          <ProtectedRoute allowedRoles={['pharmacy']}>
            <PharmacyDashboard />
          </ProtectedRoute>
        } />
        
        {/* Protected Delivery Routes */}
        <Route path="/delivery" element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <DeliveryDashboard />
          </ProtectedRoute>
        } />

        <Route path="/library" element={<MedicationLibrary />} />
        
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
