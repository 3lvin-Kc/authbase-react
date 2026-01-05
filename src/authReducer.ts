// Deterministic state machine for authentication
// All state transitions are explicit and predictable, no funny business

import { AuthState, AuthAction } from './types';

export const initialState: AuthState = {
  status: 'idle', // we start chillin
  user: null, // nobody logged in yet
  accessToken: null, // no token yet
  refreshToken: null, // no refresh token either
  error: null, // no errors yet, hopefully it stays this way
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    // Initialization - happens once on mount, ya know
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

    // Login flow - where the magic happens
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

    // Logout flow - say goodbye to the user
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
      // Even if logout fails, clear local state anyway
      return {
        status: 'unauthenticated',
        user: null,
        accessToken: null,
        refreshToken: null,
        error: action.payload.error,
      };

    // Refresh flow - explicitly triggered by developer, not automatic
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
      // Refresh failure means session is dead, sorry folks
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