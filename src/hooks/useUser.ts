// User data hook - convenience accessor, just the user stuff

import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { User } from '../types';

export function useUser(): User | null {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useUser must be used within AuthProvider');
  }

  return context.state.user;
}