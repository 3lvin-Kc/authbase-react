// Main provider component
// Orchestrates auth operations and provides context
import React, { useReducer, useEffect, useCallback, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { authReducer, initialState } from './authReducer';
import { AuthStorage } from './storage';
export function AuthProvider({ config, children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const storageRef = useRef(new AuthStorage(config.storage));
    // Initialize auth state from storage on mount
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
        }
        else {
            dispatch({ type: 'INIT_FAILURE' });
        }
    }, []);
    // Sync state to storage when authenticated
    useEffect(() => {
        const storage = storageRef.current;
        if (state.status === 'authenticated' && state.accessToken && state.user) {
            storage.save(state.accessToken, state.refreshToken, state.user);
        }
        else if (state.status === 'unauthenticated') {
            storage.clear();
        }
    }, [state.status, state.accessToken, state.refreshToken, state.user]);
    // Sign in - explicit operation
    const signIn = useCallback(async (identifier, secret) => {
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
            const data = await response.json();
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: data.user,
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token || null,
                },
            });
        }
        catch (error) {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: { error: error },
            });
            throw error;
        }
    }, [config.endpoints.login]);
    // Sign out - explicit operation
    const signOut = useCallback(async () => {
        dispatch({ type: 'LOGOUT_START' });
        // If logout endpoint exists, call it
        if (config.endpoints.logout && state.accessToken) {
            try {
                await fetch(config.endpoints.logout, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${state.accessToken}`,
                    },
                });
                dispatch({ type: 'LOGOUT_SUCCESS' });
            }
            catch (error) {
                // Still clear local state even if backend logout fails
                dispatch({
                    type: 'LOGOUT_FAILURE',
                    payload: { error: error },
                });
            }
        }
        else {
            // No logout endpoint, just clear local state
            dispatch({ type: 'LOGOUT_SUCCESS' });
        }
    }, [config.endpoints.logout, state.accessToken]);
    // Refresh - explicit operation, not automatic
    const refresh = useCallback(async () => {
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
            const data = await response.json();
            dispatch({
                type: 'REFRESH_SUCCESS',
                payload: { accessToken: data.access_token },
            });
        }
        catch (error) {
            dispatch({
                type: 'REFRESH_FAILURE',
                payload: { error: error },
            });
            throw error;
        }
    }, [config.endpoints.refresh, state.refreshToken]);
    // Clear error state
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
    return React.createElement(AuthContext.Provider, { value: value }, children);
}
