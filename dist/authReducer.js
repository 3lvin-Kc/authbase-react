// Deterministic state machine for authentication
// All state transitions are explicit and predictable
export const initialState = {
    status: 'idle',
    user: null,
    accessToken: null,
    refreshToken: null,
    error: null,
};
export function authReducer(state, action) {
    switch (action.type) {
        // Initialization - happens once on mount
        case 'INIT_START':
            return {
                ...state,
                status: 'loading',
                error: null,
            };
        case 'INIT_SUCCESS':
            return {
                status: 'authenticated',
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                error: null,
            };
        case 'INIT_FAILURE':
            return {
                status: 'unauthenticated',
                user: null,
                accessToken: null,
                refreshToken: null,
                error: null,
            };
        // Login flow
        case 'LOGIN_START':
            return {
                ...state,
                status: 'loading',
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                status: 'authenticated',
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                status: 'unauthenticated',
                user: null,
                accessToken: null,
                refreshToken: null,
                error: action.payload.error,
            };
        // Logout flow
        case 'LOGOUT_START':
            return {
                ...state,
                status: 'loading',
                error: null,
            };
        case 'LOGOUT_SUCCESS':
            return {
                status: 'unauthenticated',
                user: null,
                accessToken: null,
                refreshToken: null,
                error: null,
            };
        case 'LOGOUT_FAILURE':
            // Even if logout fails, clear local state
            return {
                status: 'unauthenticated',
                user: null,
                accessToken: null,
                refreshToken: null,
                error: action.payload.error,
            };
        // Refresh flow - explicitly triggered by developer
        case 'REFRESH_START':
            return {
                ...state,
                status: 'loading',
                error: null,
            };
        case 'REFRESH_SUCCESS':
            return {
                ...state,
                status: 'authenticated',
                accessToken: action.payload.accessToken,
                error: null,
            };
        case 'REFRESH_FAILURE':
            // Refresh failure means session is dead
            return {
                status: 'unauthenticated',
                user: null,
                accessToken: null,
                refreshToken: null,
                error: action.payload.error,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}
