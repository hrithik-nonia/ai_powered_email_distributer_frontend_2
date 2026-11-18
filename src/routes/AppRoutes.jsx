import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { VerifyOtpPage } from '../pages/auth/VerifyOtpPage';
import { AssistantDashboard } from '../pages/assistant/AssistantDashboard';
import { ClientDashboard } from '../pages/client/ClientDashboard';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // Silent session restoration on initial mount using refresh cookie
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        // Attempt silent refresh
        const refreshRes = await authApi.refresh();
        const accessToken = refreshRes.access_token;

        if (accessToken && isMounted) {
          // Store token in Zustand
          useAuthStore.getState().setAccessToken(accessToken);

          // Hydrate user profile
          const userRes = await authApi.getMe();
          if (isMounted) {
            setAuth({ accessToken, user: userRes });
          }
        }
      } catch (e) {
        // No active refresh session or invalid; leave unauthenticated
      } finally {
        if (isMounted) {
          setInitialized(true);
        }
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, [setAuth, setInitialized]);

  // Root redirect helper
  const getHomeRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }
    return user.role === 'client' ? (
      <Navigate to="/client" replace />
    ) : (
      <Navigate to="/assistant" replace />
    );
  };

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={getHomeRedirect()} />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? getHomeRedirect() : <LoginPage />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? getHomeRedirect() : <RegisterPage />
        }
      />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      {/* Protected Assistant Routes */}
      <Route
        path="/assistant"
        element={
          <ProtectedRoute allowedRole="assistant">
            <AssistantDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Client Routes */}
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRole="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
