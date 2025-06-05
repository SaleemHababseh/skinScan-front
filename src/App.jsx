import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Authentication Components
import AuthProvider from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import AppLayout from './components/layout/AppLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

// Authentication Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

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
import TopDoctors from './pages/TopDoctors';

function App() {
  return (
    <AuthProvider>
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
        } />        <Route path="/news" element={
          <AppLayout>
            <News />
          </AppLayout>
        } />
        <Route path="/doctors" element={
          <AppLayout>
            <TopDoctors />
          </AppLayout>
        } />
          {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        
        {/* Redirect old auth routes */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        
        {/* Patient Routes - Protected */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute requiredRole="patient">
            <DashboardLayout>
              <PatientDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/patient/diagnoses" element={
          <ProtectedRoute requiredRole="patient">
            <DashboardLayout>
              <PatientDiagnoses />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/patient/appointments" element={
          <ProtectedRoute requiredRole="patient">
            <DashboardLayout>
              <PatientAppointments />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/patient/upload" element={
          <ProtectedRoute requiredRole="patient">
            <DashboardLayout>
              <PatientUpload />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Doctor Routes - Protected */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute requiredRole="doctor">
            <DashboardLayout>
              <DoctorDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/doctor/patients" element={
          <ProtectedRoute requiredRole="doctor">
            <DashboardLayout>
              <DoctorPatients />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/doctor/appointments" element={
          <ProtectedRoute requiredRole="doctor">
            <DashboardLayout>
              <DoctorAppointments />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <AdminUsers />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <AdminReports />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Shared Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;