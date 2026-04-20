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
const Profile = lazy(() => import('../pages/Profile'));
const Messages = lazy(() => import('../pages/Messages'));

// Phase 5 Components
const TwoFactorSetup = lazy(() => import('../components/auth/TwoFactorSetup'));
const PrescriptionRefills = lazy(() => import('../components/patient/PrescriptionRefills'));
const AdvancedMedicationSearch = lazy(() => import('../components/library/AdvancedMedicationSearch'));
const NotificationCenter = lazy(() => import('../components/notifications/NotificationCenter'));
const NotificationPreferences = lazy(() => import('../components/settings/NotificationPreferences'));
const DoctorDashboard = lazy(() => import('../components/doctor/DoctorDashboard'));
const DeliveryTracking = lazy(() => import('../components/delivery/DeliveryTracking'));
const PharmacyRefillApproval = lazy(() => import('../components/pharmacy/PharmacyRefillApproval'));


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

        <Route path="/medications/search" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DashboardErrorBoundary>
              <AdvancedMedicationSearch />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />

        <Route path="/patient/refills" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DashboardErrorBoundary>
              <PrescriptionRefills />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />

        <Route path="/auth/two-factor" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DashboardErrorBoundary>
              <TwoFactorSetup />
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

        <Route path="/pharmacy/refills" element={
          <ProtectedRoute allowedRoles={['pharmacy']}>
            <DashboardErrorBoundary>
              <PharmacyRefillApproval />
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

        <Route path="/delivery/tracking" element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <DashboardErrorBoundary>
              <DeliveryTracking />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />

        {/* Protected Doctor Routes */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DashboardErrorBoundary>
              <DoctorDashboard />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />

        <Route path="/library" element={<MedicationLibrary />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardErrorBoundary>
              <Profile />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={<Settings />} />

        {/* Notification Routes */}
        <Route path="/notifications" element={
          <ProtectedRoute>
            <DashboardErrorBoundary>
              <NotificationCenter />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />

        <Route path="/notifications/preferences" element={
          <ProtectedRoute>
            <DashboardErrorBoundary>
              <NotificationPreferences />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />

        {/* Messaging Routes */}
        <Route path="/messages/patient" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DashboardErrorBoundary>
              <Messages />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/messages/delivery" element={
          <ProtectedRoute allowedRoles={['delivery']}>
             <DashboardErrorBoundary>
              <Messages />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/messages/medical" element={
          <ProtectedRoute allowedRoles={['pharmacy', 'doctor']}>
             <DashboardErrorBoundary>
              <Messages />
            </DashboardErrorBoundary>
          </ProtectedRoute>
        } />
        

        
        {/* Dashboard Unified Redirect */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        } />

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

/**
 * Redirects user to their specific dashboard based on role
 */
const DashboardRedirect = () => {
  const { user } = useAuthStore();
  if (user?.role === 'patient') return <Navigate to="/patient" replace />;
  if (user?.role === 'pharmacy') return <Navigate to="/pharmacy" replace />;
  if (user?.role === 'delivery') return <Navigate to="/delivery" replace />;
  return <Navigate to="/" replace />;
};

export default AppRoutes;
