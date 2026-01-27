import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import DashboardErrorBoundary from '../components/ui/DashboardErrorBoundary';

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Settings = lazy(() => import('../pages/Settings'));
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
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Audit Log: Unauthorized access attempt
    console.warn(`[RBAC] Access Denied for user ${user.id} (${user.role}) to restricted route. Required: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Patient Routes */}
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DashboardErrorBoundary>
              <PatientDashboard />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/medications" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DashboardErrorBoundary>
              <Medications />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />
        
        {/* Protected Pharmacy Routes */}
        <Route path="/pharmacy" element={
          <ProtectedRoute allowedRoles={['pharmacy']}>
            <DashboardErrorBoundary>
              <PharmacyDashboard />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />
        
        {/* Protected Delivery Routes */}
        <Route path="/delivery" element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <DashboardErrorBoundary>
              <DeliveryDashboard />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />

        <Route path="/library" element={<MedicationLibrary />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
