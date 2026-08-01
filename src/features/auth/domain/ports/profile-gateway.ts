import type { Result } from '@core/result';
import type { AppError } from '@core/errors';

export interface UserProfile {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly role: string;
  readonly isActive: boolean;
  readonly memberId: string | null;
  readonly branchId: string | null;
  readonly branchName: string | null;
}

/** Port: profile operations. Implemented in infrastructure. */
export interface ProfileGateway {
  getProfile(): Promise<Result<UserProfile, AppError>>;
  updatePassword(currentPassword: string, newPassword: string): Promise<Result<void, AppError>>;
  updateUsername(newUsername: string): Promise<Result<void, AppError>>;
  updateEmail(newEmail: string): Promise<Result<void, AppError>>;
}
