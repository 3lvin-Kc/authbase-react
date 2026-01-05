// Token persistence layer
// Simple, swappable, no magic here folks

import { User } from './types';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'authbase_access_token', // where we keep the access token
  REFRESH_TOKEN: 'authbase_refresh_token', // where we keep the refresh token
  USER: 'authbase_user', // where we keep user info
} as const;

export interface StoredAuth {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

export class AuthStorage {
  private storage: Storage;

  constructor(storage: Storage = window.localStorage) {
    this.storage = storage;
  }

  // Save authentication data to storage
  save(accessToken: string, refreshToken: string | null, user: User): void {
    try {
      this.storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      
      if (refreshToken) {
        this.storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      } else {
        this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
      
      this.storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      // Storage quota exceeded or blocked, oops
      console.error('Failed to save auth data:', error);
    }
  }

  // Load authentication data - safe rehydration, no funny stuff
  load(): StoredAuth {
    try {
      const accessToken = this.storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = this.storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const userJson = this.storage.getItem(STORAGE_KEYS.USER);

      // All or nothing - if access token missing, ignore everything
      if (!accessToken) {
        return { accessToken: null, refreshToken: null, user: null };
      }

      let user: User | null = null;
      if (userJson) {
        try {
          user = JSON.parse(userJson);
        } catch {
          // Corrupted user data - fail safe, better to be safe than sorry
          this.clear();
          return { accessToken: null, refreshToken: null, user: null };
        }
      }

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      // Storage access error, darn it
      console.error('Failed to load auth data:', error);
      return { accessToken: null, refreshToken: null, user: null };
    }
  }

  // Clear all authentication data, wipe it clean
  clear(): void {
    try {
      this.storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      this.storage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  // Update only access token (used during refresh), quick update
  updateAccessToken(accessToken: string): void {
    try {
      this.storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    } catch (error) {
      console.error('Failed to update access token:', error);
    }
  }
}