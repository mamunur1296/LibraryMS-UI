import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { AuthSession } from '../entities/auth-session';

/** Port: authentication operations. Implemented in infrastructure. */
export interface AuthGateway {
  login(username: string, password: string): Promise<Result<AuthSession, AppError>>;
  refreshToken(refreshToken: string): Promise<Result<AuthSession, AppError>>;
  revokeToken(refreshToken: string): Promise<Result<void, AppError>>;
  register(username: string, email: string, password: string): Promise<Result<string, AppError>>;
}
