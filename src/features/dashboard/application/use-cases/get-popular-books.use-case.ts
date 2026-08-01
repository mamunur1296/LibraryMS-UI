import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { DashboardGateway } from '../../domain/ports/dashboard-gateway';
import type { PopularBook } from '../../domain/models/dashboard';

export class GetPopularBooksUseCase {
  public constructor(private readonly dashboardGateway: DashboardGateway) {}

  public async execute(limit?: number): Promise<Result<PopularBook[], AppError>> {
    return this.dashboardGateway.getPopularBooks(limit);
  }
}
