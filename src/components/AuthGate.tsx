// Auth gate - protects the entire tree and renders a default login form

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';

interface AuthGateProps {
  children: React.ReactNode;
  loginFallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export function AuthGate({
  children,
  loginFallback,
  loadingFallback = null,
  errorFallback,
}: AuthGateProps) {
  const { isAuthenticated, isLoading, error } = useAuth();
  const defaultLogin = (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <LoginForm />
    </div>
  );

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (error) {
    return <>{errorFallback ?? loginFallback ?? defaultLogin}</>;
  }

  if (!isAuthenticated) {
    return <>{loginFallback ?? defaultLogin}</>;
  }

  return <>{children}</>;
}
