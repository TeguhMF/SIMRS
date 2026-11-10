import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PendaftaranFO from './pages/PendaftaranFO';
import NurseStation from './pages/NurseStation';
import RMEDokter from './pages/RMEDokter';
import Laboratorium from './pages/Laboratorium';
import Farmasi from './pages/Farmasi';
import BillingKasir from './pages/BillingKasir';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* General Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Admin Control Tower Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['super-admin', 'admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Front Office Route */}
        <Route 
          path="/pendaftaran" 
          element={
            <ProtectedRoute allowedRoles={['super-admin', 'admin', 'petugas-fo']}>
              <PendaftaranFO />
            </ProtectedRoute>
          } 
        />

        {/* Nurse Station Route */}
        <Route 
          path="/perawat" 
          element={
            <ProtectedRoute allowedRoles={['super-admin', 'admin', 'perawat']}>
              <NurseStation />
            </ProtectedRoute>
          } 
        />

        {/* RME Dokter Route */}
        <Route 
          path="/dokter" 
          element={
            <ProtectedRoute allowedRoles={['super-admin', 'admin', 'dokter']}>
              <RMEDokter />
            </ProtectedRoute>
          } 
        />

        {/* Laboratorium Route */}
        <Route 
          path="/laboratorium" 
          element={
            <ProtectedRoute allowedRoles={['super-admin', 'admin', 'petugas-lab']}>
              <Laboratorium />
            </ProtectedRoute>
          } 
        />

        {/* Farmasi Route */}
        <Route 
          path="/farmasi" 
          element={
            <ProtectedRoute allowedRoles={['super-admin', 'admin', 'apoteker']}>
              <Farmasi />
            </ProtectedRoute>
          } 
        />

        {/* Billing Kasir Route */}
        <Route 
          path="/billing" 
          element={
            <ProtectedRoute allowedRoles={['super-admin', 'admin', 'kasir']}>
              <BillingKasir />
            </ProtectedRoute>
          } 
        />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}