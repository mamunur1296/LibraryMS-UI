import { AuthSession } from '../domain/entities/auth-session';
import type { SessionStore } from '../domain/ports/session-store';

const SESSION_KEY = 'libraryms_session';

interface StoredSession {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: string;
  readonly userId: string;
  readonly username: string;
  readonly email: string;
  readonly role: string;
  readonly memberId: string | null;
  readonly branchId: string | null;
  readonly branchName: string | null;
}

/** Persists the AuthSession in localStorage. */
export class LocalSessionStore implements SessionStore {
  public save(session: AuthSession): void {
    const stored: StoredSession = {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt.toISOString(),
      userId: session.userId,
      username: session.username,
      email: session.email,
      role: session.role,
      memberId: session.memberId,
      branchId: session.branchId,
      branchName: session.branchName,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
  }

  public load(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw === null) return null;

    try {
      const stored = JSON.parse(raw) as StoredSession;
      return new AuthSession({
        ...stored,
        expiresAt: new Date(stored.expiresAt),
      });
    } catch {
      this.clear();
      return null;
    }
  }

  public clear(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}
