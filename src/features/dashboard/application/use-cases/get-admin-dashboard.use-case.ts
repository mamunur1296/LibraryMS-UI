import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { DashboardGateway } from '../../domain/ports/dashboard-gateway';
import type { AdminDashboard } from '../../domain/models/dashboard';

export class GetAdminDashboardUseCase {
  public constructor(private readonly dashboardGateway: DashboardGateway) {}

  public async execute(): Promise<Result<AdminDashboard, AppError>> {
    return this.dashboardGateway.getAdminDashboard();
  }
}
