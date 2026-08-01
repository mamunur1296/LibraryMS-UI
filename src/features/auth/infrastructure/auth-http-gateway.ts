import { err, ok } from '@core/result';
import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import { ServerError } from '@core/errors';
import type { HttpClient } from '@core/http';
import type { AuthGateway } from '../domain/ports/auth-gateway';
import { AuthSession } from '../domain/entities/auth-session';
import { AuthResponseSchema, type AuthResponseDto } from './dto/auth-dto';

/** Maps the validated AuthResponseDto to the AuthSession domain entity. */
function mapToSession(dto: AuthResponseDto): AuthSession {
  return new AuthSession({
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
    expiresAt: new Date(dto.expiresAt),
    userId: dto.user.id,
    username: dto.user.username,
    email: dto.user.email,
    role: dto.user.role,
    memberId: dto.user.memberId ?? null,
    branchId: dto.user.branchId ?? null,
    branchName: dto.user.branchName ?? null,
  });
}

export class AuthHttpGateway implements AuthGateway {
  public constructor(private readonly http: HttpClient) {}

  public async login(username: string, password: string): Promise<Result<AuthSession, AppError>> {
    try {
      const raw = await this.http.post('/api/v1/Auth/login', { username, password });
      const dto = AuthResponseSchema.parse(raw);
      return ok(mapToSession(dto));
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        return err(error as AppError);
      }
      return err(new ServerError('Login failed.'));
    }
  }

  public async refreshToken(accessToken: string, refreshToken: string): Promise<Result<AuthSession, AppError>> {
    try {
      const raw = await this.http.post('/api/v1/Auth/refresh', { accessToken, refreshToken });
      const dto = AuthResponseSchema.parse(raw);
      return ok(mapToSession(dto));
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        return err(error as AppError);
      }
      return err(new ServerError('Token refresh failed.'));
    }
  }

  public async revokeToken(refreshToken: string): Promise<Result<void, AppError>> {
    try {
      await this.http.post('/api/v1/Auth/revoke', { refreshToken });
      return ok(undefined);
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        return err(error as AppError);
      }
      return err(new ServerError('Token revoke failed.'));
    }
  }

  public async register(
    username: string,
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string,
    phone: string,
  ): Promise<Result<string, AppError>> {
    try {
      const id = await this.http.post<string>('/api/v1/Auth/register', {
        username,
        email,
        password,
        role,
        firstName,
        lastName,
        phone,
      });
      return ok(id);
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        return err(error as AppError);
      }
      return err(new ServerError('Registration failed.'));
    }
  }
}
