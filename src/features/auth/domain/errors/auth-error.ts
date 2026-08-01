import { DomainError } from '@core/errors';

export class AuthError extends DomainError {
  public constructor(message: string, code = 'AUTH_ERROR') {
    super(message, code);
  }
}

export class InvalidCredentialsError extends AuthError {
  public constructor() {
    super('Invalid username or password.', 'INVALID_CREDENTIALS');
  }
}

export class SessionExpiredError extends AuthError {
  public constructor() {
    super('Your session has expired. Please log in again.', 'SESSION_EXPIRED');
  }
}
