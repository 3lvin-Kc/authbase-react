// Authentication status hook - boolean convenience
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
export function useIsAuthenticated() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useIsAuthenticated must be used within AuthProvider');
    }
    return context.state.status === 'authenticated';
}
