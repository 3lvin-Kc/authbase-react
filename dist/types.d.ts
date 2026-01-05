export interface AuthConfig {
    endpoints: {
        login: string;
        refresh?: string;
        logout?: string;
    };
    storage?: Storage;
}
export interface User {
    [key: string]: any;
}
export interface LoginResponse {
    access_token: string;
    refresh_token?: string;
    user: User;
}
export interface RefreshResponse {
    access_token: string;
}
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
export interface AuthState {
    status: AuthStatus;
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    error: Error | null;
}
export type AuthAction = {
    type: 'INIT_START';
} | {
    type: 'INIT_SUCCESS';
    payload: {
        user: User;
        accessToken: string;
        refreshToken: string | null;
    };
} | {
    type: 'INIT_FAILURE';
} | {
    type: 'LOGIN_START';
} | {
    type: 'LOGIN_SUCCESS';
    payload: {
        user: User;
        accessToken: string;
        refreshToken: string | null;
    };
} | {
    type: 'LOGIN_FAILURE';
    payload: {
        error: Error;
    };
} | {
    type: 'LOGOUT_START';
} | {
    type: 'LOGOUT_SUCCESS';
} | {
    type: 'LOGOUT_FAILURE';
    payload: {
        error: Error;
    };
} | {
    type: 'REFRESH_START';
} | {
    type: 'REFRESH_SUCCESS';
    payload: {
        accessToken: string;
    };
} | {
    type: 'REFRESH_FAILURE';
    payload: {
        error: Error;
    };
} | {
    type: 'CLEAR_ERROR';
};
export interface AuthContextValue {
    state: AuthState;
    signIn: (identifier: string, secret: string) => Promise<void>;
    signOut: () => Promise<void>;
    refresh: () => Promise<void>;
    clearError: () => void;
}
