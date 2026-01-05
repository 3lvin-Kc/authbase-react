// Token persistence layer
// Simple, swappable, no magic
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'authbase_access_token',
    REFRESH_TOKEN: 'authbase_refresh_token',
    USER: 'authbase_user',
};
export class AuthStorage {
    constructor(storage = window.localStorage) {
        this.storage = storage;
    }
    // Save authentication data
    save(accessToken, refreshToken, user) {
        try {
            this.storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            if (refreshToken) {
                this.storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            }
            else {
                this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            }
            this.storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }
        catch (error) {
            // Storage quota exceeded or blocked
            console.error('Failed to save auth data:', error);
        }
    }
    // Load authentication data - safe rehydration
    load() {
        try {
            const accessToken = this.storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const refreshToken = this.storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            const userJson = this.storage.getItem(STORAGE_KEYS.USER);
            // All or nothing - if access token missing, ignore everything
            if (!accessToken) {
                return { accessToken: null, refreshToken: null, user: null };
            }
            let user = null;
            if (userJson) {
                try {
                    user = JSON.parse(userJson);
                }
                catch {
                    // Corrupted user data - fail safe
                    this.clear();
                    return { accessToken: null, refreshToken: null, user: null };
                }
            }
            return {
                accessToken,
                refreshToken,
                user,
            };
        }
        catch (error) {
            // Storage access error
            console.error('Failed to load auth data:', error);
            return { accessToken: null, refreshToken: null, user: null };
        }
    }
    // Clear all authentication data
    clear() {
        try {
            this.storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            this.storage.removeItem(STORAGE_KEYS.USER);
        }
        catch (error) {
            console.error('Failed to clear auth data:', error);
        }
    }
    // Update only access token (used during refresh)
    updateAccessToken(accessToken) {
        try {
            this.storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        }
        catch (error) {
            console.error('Failed to update access token:', error);
        }
    }
}
