import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useRole();
  const location = useLocation();

  if (!isLoggedIn) {
    const fullPath = location.pathname + location.search;
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(fullPath)}`} replace />;
  }

  return children;
}
