// Authentication status hook - boolean convenience, simple yes/no

import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export function useIsAuthenticated(): boolean {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useIsAuthenticated must be used within AuthProvider');
  }

  return context.state.status === 'authenticated';
}