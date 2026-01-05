// Main provider component
// Orchestrates auth operations and provides context, ya know?

import React, { useReducer, useEffect, useCallback, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { authReducer, initialState } from './authReducer';
import { AuthStorage } from './storage';
import { AuthConfig, LoginResponse, RefreshResponse } from './types';

interface AuthProviderProps {
  config: AuthConfig;
  children: React.ReactNode;
}

export function AuthProvider({ config, children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const storageRef = useRef(new AuthStorage(config.storage));

  // Initialize auth state from storage on mount, check if user was already here
  useEffect(() => {
    const storage = storageRef.current;
    dispatch({ type: 'INIT_START' });

    const stored = storage.load();

    if (stored.accessToken && stored.user) {
      dispatch({
        type: 'INIT_SUCCESS',
        payload: {
          user: stored.user,
          accessToken: stored.accessToken,
          refreshToken: stored.refreshToken,
        },
      });
    } else {
      dispatch({ type: 'INIT_FAILURE' });
    }
  }, []);

  // Sync state to storage when authenticated, keep things in sync
  useEffect(() => {
    const storage = storageRef.current;

    if (state.status === 'authenticated' && state.accessToken && state.user) {
      storage.save(state.accessToken, state.refreshToken, state.user);
    } else if (state.status === 'unauthenticated') {
      storage.clear();
    }
  }, [state.status, state.accessToken, state.refreshToken, state.user]);

  // Sign in - explicit operation, no magic here
  const signIn = useCallback(
    async (identifier: string, secret: string): Promise<void> => {
      dispatch({ type: 'LOGIN_START' });

      try {
        const response = await fetch(config.endpoints.login, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, secret }),
        });

        if (!response.ok) {
          throw new Error(`Login failed: ${response.status}`);
        }

        const data: LoginResponse = await response.json();

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refresh_token || null,
          },
        });
      } catch (error) {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: { error: error as Error },
        });
        throw error;
      }
    },
    [config.endpoints.login]
  );

  // Sign out - simple operation, say goodbye
  const signOut = useCallback(async (): Promise<void> => {
    dispatch({ type: 'LOGOUT_START' });

    // If logout endpoint exists, let's call it
    if (config.endpoints.logout && state.accessToken) {
      try {
        await fetch(config.endpoints.logout, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.accessToken}`,
          },
        });

        dispatch({ type: 'LOGOUT_SUCCESS' });
      } catch (error) {
        // Still clear local state even if backend logout fails, better safe than sorry
        dispatch({
          type: 'LOGOUT_FAILURE',
          payload: { error: error as Error },
        });
      }
    } else {
      // No logout endpoint, just clear local state and move on
      dispatch({ type: 'LOGOUT_SUCCESS' });
    }
  }, [config.endpoints.logout, state.accessToken]);

  // Refresh - explicit operation, not automatic, you decide when
  const refresh = useCallback(async (): Promise<void> => {
    if (!config.endpoints.refresh) {
      throw new Error('Refresh endpoint not configured');
    }

    if (!state.refreshToken) {
      throw new Error('No refresh token available');
    }

    dispatch({ type: 'REFRESH_START' });

    try {
      const response = await fetch(config.endpoints.refresh, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const data: RefreshResponse = await response.json();

      dispatch({
        type: 'REFRESH_SUCCESS',
        payload: { accessToken: data.access_token },
      });
    } catch (error) {
      dispatch({
        type: 'REFRESH_FAILURE',
        payload: { error: error as Error },
      });
      throw error;
    }
  }, [config.endpoints.refresh, state.refreshToken]);

  // Clear error state, start fresh
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    state,
    signIn,
    signOut,
    refresh,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}