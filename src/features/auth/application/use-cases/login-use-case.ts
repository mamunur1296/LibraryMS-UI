import type { Result } from '@core/result';
import { err, ok } from '@core/result';
import type { AppError } from '@core/errors';
import { UnauthorizedError } from '@core/errors';
import type { AuthSession } from '../../domain/entities/auth-session';
import type { AuthGateway } from '../../domain/ports/auth-gateway';
import type { SessionStore } from '../../domain/ports/session-store';
import { InvalidCredentialsError } from '../../domain/errors/auth-error';

export interface LoginInput {
  readonly username: string;
  readonly password: string;
}

/** Use case: authenticates the user and persists the session. */
export class LoginUseCase {
  public constructor(
    private readonly authGateway: AuthGateway,
    private readonly sessionStore: SessionStore,
  ) {}

  public async execute(input: LoginInput): Promise<Result<AuthSession, AppError>> {
    if (input.username.trim() === '' || input.password.trim() === '') {
      return err(new InvalidCredentialsError());
    }

    const result = await this.authGateway.login(input.username.trim(), input.password);

    if (result.isErr()) {
      if (result.error instanceof UnauthorizedError) {
        return err(new InvalidCredentialsError());
      }
      return err(result.error);
    }

    this.sessionStore.save(result.value);
    return ok(result.value);
  }
}
