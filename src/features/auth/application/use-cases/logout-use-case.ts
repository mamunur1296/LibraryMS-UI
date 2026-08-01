import type { Result } from '@core/result';
import { ok } from '@core/result';
import type { AppError } from '@core/errors';
import type { AuthGateway } from '../../domain/ports/auth-gateway';
import type { SessionStore } from '../../domain/ports/session-store';

/** Use case: revokes the refresh token server-side and clears the local session. */
export class LogoutUseCase {
  public constructor(
    private readonly authGateway: AuthGateway,
    private readonly sessionStore: SessionStore,
  ) {}

  public async execute(): Promise<Result<void, AppError>> {
    const session = this.sessionStore.load();

    if (session !== null) {
      // Attempt server-side revoke; ignore errors (best-effort)
      await this.authGateway.revokeToken(session.refreshToken).catch(() => undefined);
    }

    this.sessionStore.clear();
    return ok(undefined);
  }
}
