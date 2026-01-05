export interface UseAuthReturn {
    signIn: (identifier: string, secret: string) => Promise<void>;
    signOut: () => Promise<void>;
    refresh: () => Promise<void>;
    user: object | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | null;
}
export declare function useAuth(): UseAuthReturn;
