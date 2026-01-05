import { User } from './types';
export interface StoredAuth {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
}
export declare class AuthStorage {
    private storage;
    constructor(storage?: Storage);
    save(accessToken: string, refreshToken: string | null, user: User): void;
    load(): StoredAuth;
    clear(): void;
    updateAccessToken(accessToken: string): void;
}
