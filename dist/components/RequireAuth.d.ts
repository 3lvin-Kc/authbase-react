import React from 'react';
interface RequireAuthProps {
    children: React.ReactNode;
    redirectTo: string;
    fallback?: React.ReactNode;
}
export declare function RequireAuth({ children, redirectTo, fallback }: RequireAuthProps): React.JSX.Element;
export {};
