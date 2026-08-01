import { err, ok } from '@core/result';
import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import { ServerError } from '@core/errors';
import { z } from 'zod';
import type { HttpClient } from '@core/http';
import type { ProfileGateway, UserProfile } from '../domain/ports/profile-gateway';

const UserDtoSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  isActive: z.boolean(),
  memberId: z.string().nullable().optional(),
  branchId: z.string().nullable().optional(),
  branchName: z.string().nullable().optional(),
});

function mapToProfile(dto: z.infer<typeof UserDtoSchema>): UserProfile {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    role: dto.role,
    isActive: dto.isActive,
    memberId: dto.memberId ?? null,
    branchId: dto.branchId ?? null,
    branchName: dto.branchName ?? null,
  };
}

export class ProfileHttpGateway implements ProfileGateway {
  public constructor(private readonly http: HttpClient) {}

  public async getProfile(): Promise<Result<UserProfile, AppError>> {
    try {
      const raw = await this.http.get('/api/v1/profile');
      const dto = UserDtoSchema.parse(raw);
      return ok(mapToProfile(dto));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to load profile.'));
    }
  }

  public async updatePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<Result<void, AppError>> {
    try {
      await this.http.put('/api/v1/profile/password', { currentPassword, newPassword });
      return ok(undefined);
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to update password.'));
    }
  }

  public async updateUsername(newUsername: string): Promise<Result<void, AppError>> {
    try {
      await this.http.put('/api/v1/profile/username', { newUsername });
      return ok(undefined);
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to update username.'));
    }
  }

  public async updateEmail(newEmail: string): Promise<Result<void, AppError>> {
    try {
      await this.http.put('/api/v1/profile/email', { newEmail });
      return ok(undefined);
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to update email.'));
    }
  }
}
