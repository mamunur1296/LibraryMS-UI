import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { ProfileGateway, UserProfile } from '../../domain/ports/profile-gateway';

/** Use case: fetches the logged-in user's profile. */
export class GetProfileUseCase {
  public constructor(private readonly profileGateway: ProfileGateway) {}

  public async execute(): Promise<Result<UserProfile, AppError>> {
    return this.profileGateway.getProfile();
  }
}

/** Use case: updates the logged-in user's password. */
export class UpdatePasswordUseCase {
  public constructor(private readonly profileGateway: ProfileGateway) {}

  public async execute(currentPassword: string, newPassword: string): Promise<Result<void, AppError>> {
    return this.profileGateway.updatePassword(currentPassword, newPassword);
  }
}

/** Use case: updates the logged-in user's username. */
export class UpdateUsernameUseCase {
  public constructor(private readonly profileGateway: ProfileGateway) {}

  public async execute(newUsername: string): Promise<Result<void, AppError>> {
    return this.profileGateway.updateUsername(newUsername);
  }
}

/** Use case: updates the logged-in user's email. */
export class UpdateEmailUseCase {
  public constructor(private readonly profileGateway: ProfileGateway) {}

  public async execute(newEmail: string): Promise<Result<void, AppError>> {
    return this.profileGateway.updateEmail(newEmail);
  }
}
