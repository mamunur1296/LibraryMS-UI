import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { DashboardSummary, AdminDashboard, PopularBook, MemberProfileStats } from '../models/dashboard';

/** Port: dashboard operations. Implemented in infrastructure. */
export interface DashboardGateway {
  getDashboardSummary(): Promise<Result<DashboardSummary, AppError>>;
  getAdminDashboard(): Promise<Result<AdminDashboard, AppError>>;
  getPopularBooks(limit?: number): Promise<Result<PopularBook[], AppError>>;
  getMemberProfileStats(memberId: string): Promise<Result<MemberProfileStats, AppError>>;
}
