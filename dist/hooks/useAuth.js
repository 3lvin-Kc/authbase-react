// Main auth hook - exposes full auth state and operations
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
export function useAuth() {
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
