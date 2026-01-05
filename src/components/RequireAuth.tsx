// Route protection component - simple and predictable, no funny business

import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo: string;
  fallback?: React.ReactNode;
}

export function RequireAuth({ children, redirectTo, fallback = null }: RequireAuthProps) {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('RequireAuth must be used within AuthProvider');
  }

  const { state } = context;

  // Redirect if unauthenticated
  useEffect(() => {
    if (state.status === 'unauthenticated') {
      window.location.href = redirectTo;
    }
  }, [state.status, redirectTo]);

  // Still loading initial auth state
  if (state.status === 'idle' || state.status === 'loading') {
    return <>{fallback}</>;
  }

  // Not authenticated - will redirect via useEffect
  if (state.status === 'unauthenticated') {
    return <>{fallback}</>;
  }

  // Authenticated - render children
  if (state.status === 'authenticated') {
    return <>{children}</>;
  }

  // Error state - don't render protected content
  return <>{fallback}</>;
}