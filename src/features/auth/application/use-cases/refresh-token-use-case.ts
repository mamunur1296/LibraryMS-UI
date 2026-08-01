import type { Result } from '@core/result';
import { err, ok } from '@core/result';
import type { AppError } from '@core/errors';
import type { AuthSession } from '../../domain/entities/auth-session';
import type { AuthGateway } from '../../domain/ports/auth-gateway';
import type { SessionStore } from '../../domain/ports/session-store';
import { SessionExpiredError } from '../../domain/errors/auth-error';

/** Use case: refreshes the access token using the stored refresh token. */
export class RefreshTokenUseCase {
  public constructor(
    private readonly authGateway: AuthGateway,
    private readonly sessionStore: SessionStore,
  ) {}

  public async execute(): Promise<Result<AuthSession, AppError>> {
    const session = this.sessionStore.load();

    if (session === null) {
      return err(new SessionExpiredError());
    }

    const result = await this.authGateway.refreshToken(session.accessToken, session.refreshToken);

    if (result.isErr()) {
      this.sessionStore.clear();
      return err(result.error);
    }

    this.sessionStore.save(result.value);
    return ok(result.value);
  }
}
