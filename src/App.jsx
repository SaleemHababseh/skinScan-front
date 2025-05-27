import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/auth-store';

// Layouts
import AppLayout from './components/layout/AppLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

// Authentication Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientDiagnoses from './pages/patient/Diagnoses';
import PatientAppointments from './pages/patient/Appointments';
import PatientUpload from './pages/patient/Upload';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatients from './pages/doctor/Patients';
import DoctorAppointments from './pages/doctor/Appointments';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminReports from './pages/admin/Reports';

// Shared Pages
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import News from './pages/News';

function App() {
  const { initialize, isAuthenticated, user, isLoading } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <AppLayout>
          <Home />
        </AppLayout>
      } />
      <Route path="/about" element={
        <AppLayout>
          <About />
        </AppLayout>
      } />
      <Route path="/contact" element={
        <AppLayout>
          <Contact />
        </AppLayout>
      } />
      <Route path="/news" element={
        <AppLayout>
          <News />
        </AppLayout>
      } />
      
      {/* Auth Routes */}
      <Route path="/login" element={
        isAuthenticated ? (
          <Navigate to={`/${user.role}/dashboard`} replace />
        ) : (
          <Login />
        )
      } />
      <Route path="/register" element={
        isAuthenticated ? (
          <Navigate to={`/${user.role}/dashboard`} replace />
        ) : (
          <Register />
        )
      } />
      
      {/* Patient Routes */}
      <Route path="/patient/dashboard" element={
        <DashboardLayout>
          <PatientDashboard />
        </DashboardLayout>
      } />
      <Route path="/patient/diagnoses" element={
        <DashboardLayout>
          <PatientDiagnoses />
        </DashboardLayout>
      } />
      <Route path="/patient/appointments" element={
        <DashboardLayout>
          <PatientAppointments />
        </DashboardLayout>
      } />
      <Route path="/patient/upload" element={
        <DashboardLayout>
          <PatientUpload />
        </DashboardLayout>
      } />
      
      {/* Doctor Routes */}
      <Route path="/doctor/dashboard" element={
        <DashboardLayout>
          <DoctorDashboard />
        </DashboardLayout>
      } />
      <Route path="/doctor/patients" element={
        <DashboardLayout>
          <DoctorPatients />
        </DashboardLayout>
      } />
      <Route path="/doctor/appointments" element={
        <DashboardLayout>
          <DoctorAppointments />
        </DashboardLayout>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      } />
      <Route path="/admin/users" element={
        <DashboardLayout>
          <AdminUsers />
        </DashboardLayout>
      } />
      <Route path="/admin/reports" element={
        <DashboardLayout>
          <AdminReports />
        </DashboardLayout>
      } />
      
      {/* Shared Routes */}
      <Route path="/profile" element={
        <DashboardLayout>
          <Profile />
        </DashboardLayout>
      } />
      <Route path="/settings" element={
        <DashboardLayout>
          <Settings />
        </DashboardLayout>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;