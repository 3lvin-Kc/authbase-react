// Main auth hook - exposes full auth state and operations, the good stuff

import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export interface UseAuthReturn {
  signIn: (identifier: string, secret: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  user: object | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  const { state, signIn, signOut, refresh } = context;

  return {
    signIn,
    signOut,
    refresh,
    user: state.user,
    accessToken: state.accessToken,
    isAuthenticated: state.status === 'authenticated',
    isLoading: state.status === 'loading',
    error: state.error,
  };
}