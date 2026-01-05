import React from 'react';
import { AuthConfig } from './types';
interface AuthProviderProps {
    config: AuthConfig;
    children: React.ReactNode;
}
export declare function AuthProvider({ config, children }: AuthProviderProps): React.JSX.Element;
export {};
