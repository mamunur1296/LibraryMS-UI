import type { AuthSession } from '../entities/auth-session';

/** Port: persists and retrieves the auth session. Implemented in infrastructure. */
export interface SessionStore {
  save(session: AuthSession): void;
  load(): AuthSession | null;
  clear(): void;
}
