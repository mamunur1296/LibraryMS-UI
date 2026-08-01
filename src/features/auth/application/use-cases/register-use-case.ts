import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { AuthGateway } from '../../domain/ports/auth-gateway';

export interface RegisterInput {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
}

/** Use case: registers a new user account. */
export class RegisterUseCase {
  public constructor(private readonly authGateway: AuthGateway) {}

  public async execute(input: RegisterInput): Promise<Result<string, AppError>> {
    return this.authGateway.register(
      input.username.trim(), 
      input.email.trim(), 
      input.password,
      'Member',
      input.firstName.trim(),
      input.lastName.trim(),
      input.phone.trim()
    );
  }
}
