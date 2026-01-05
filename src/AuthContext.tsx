// React context for auth state
// Simple container, no logic here folks

import { createContext } from 'react';
import { AuthContextValue } from './types';

export const AuthContext = createContext<AuthContextValue | null>(null);
AuthContext.displayName = 'AuthContext';