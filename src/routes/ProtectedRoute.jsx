import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Spinner } from '../components/common/Spinner';

export function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);

  // If the initial refresh / session check is still running, show loading
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to the user's correct home route
    const targetRoute = user.role === 'client' ? '/client' : '/assistant';
    return <Navigate to={targetRoute} replace />;
  }

  return children;
}
