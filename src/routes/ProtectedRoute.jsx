import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-red-600">Akses Ditolak (403)</h2>
        <p className="text-xs text-slate-600 mt-1">Role Anda ({user.role}) tidak memiliki izin untuk membuka halaman ini.</p>
      </div>
    );
  }

  return children;
}