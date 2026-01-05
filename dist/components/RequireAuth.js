// Route protection component - simple and predictable
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
export function RequireAuth({ children, redirectTo, fallback = null }) {
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
        return React.createElement(React.Fragment, null, fallback);
    }
    // Not authenticated - will redirect via useEffect
    if (state.status === 'unauthenticated') {
        return React.createElement(React.Fragment, null, fallback);
    }
    // Authenticated - render children
    if (state.status === 'authenticated') {
        return React.createElement(React.Fragment, null, children);
    }
    // Error state - don't render protected content
    return React.createElement(React.Fragment, null, fallback);
}
