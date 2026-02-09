// Public API - only export what consumers need, keep it simple

export { AuthProvider } from './AuthProvider';
export { RequireAuth } from './components/RequireAuth';
export { AuthGate } from './components/AuthGate';
export { LoginForm } from './components/LoginForm';
export { LogoutButton } from './components/LogoutButton';
export { useAuth } from './hooks/useAuth';
export { useUser } from './hooks/useUser';
export { useIsAuthenticated } from './hooks/useIsAuthenticated';

export type { AuthConfig, User } from './types';
