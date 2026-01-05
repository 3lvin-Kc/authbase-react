// User data hook - convenience accessor
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
export function useUser() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useUser must be used within AuthProvider');
    }
    return context.state.user;
}
