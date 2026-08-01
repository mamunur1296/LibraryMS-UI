import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { DashboardGateway } from '../../domain/ports/dashboard-gateway';
import type { DashboardSummary } from '../../domain/models/dashboard';

export class GetDashboardSummaryUseCase {
  public constructor(private readonly dashboardGateway: DashboardGateway) {}

  public async execute(): Promise<Result<DashboardSummary, AppError>> {
    return this.dashboardGateway.getDashboardSummary();
  }
}
