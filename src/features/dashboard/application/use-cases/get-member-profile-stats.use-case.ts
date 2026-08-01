import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { DashboardGateway } from '../../domain/ports/dashboard-gateway';
import type { MemberProfileStats } from '../../domain/models/dashboard';

export class GetMemberProfileStatsUseCase {
  public constructor(private readonly dashboardGateway: DashboardGateway) {}

  public async execute(memberId: string): Promise<Result<MemberProfileStats, AppError>> {
    return this.dashboardGateway.getMemberProfileStats(memberId);
  }
}
