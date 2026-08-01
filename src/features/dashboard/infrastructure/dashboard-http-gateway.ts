import { err, ok } from '@core/result';
import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import { ServerError } from '@core/errors';
import { z } from 'zod';
import type { HttpClient } from '@core/http';
import type { DashboardGateway } from '../domain/ports/dashboard-gateway';
import type { DashboardSummary, AdminDashboard, PopularBook, MemberProfileStats } from '../domain/models/dashboard';

const DashboardSummarySchema = z.object({
  totalBooks: z.number(),
  totalMembers: z.number(),
  activeBorrows: z.number(),
  overdueBorrows: z.number(),
  pendingReservations: z.number(),
  totalBranches: z.number(),
  totalLateFinesCollected: z.number(),
  pendingLateFines: z.number(),
});

const BranchSummarySchema = z.object({
  branchId: z.string(),
  branchName: z.string(),
  totalBooks: z.number(),
  totalMembers: z.number(),
  activeBorrows: z.number(),
  overdueBorrows: z.number(),
  totalRevenue: z.number(),
});

const AdminDashboardSchema = z.object({
  totalSummary: DashboardSummarySchema,
  branchSummaries: z.array(BranchSummarySchema),
});

const PopularBookSchema = z.object({
  bookId: z.string(),
  title: z.string(),
  authorName: z.string(),
  categoryName: z.string(),
  totalBorrows: z.number(),
});

const MemberProfileStatsSchema = z.object({
  memberId: z.string(),
  totalBorrows: z.number(),
  activeBorrows: z.number(),
  overdueBorrows: z.number(),
  activeReservations: z.number(),
  totalFinesDue: z.number(),
  totalFinesPaid: z.number(),
  membershipExpiry: z.string(),
  nearestDueDate: z.string().nullable(),
  favouriteCount: z.number(),
});

export class DashboardHttpGateway implements DashboardGateway {
  public constructor(private readonly http: HttpClient) {}

  public async getDashboardSummary(): Promise<Result<DashboardSummary, AppError>> {
    try {
      const raw = await this.http.get('/api/v1/Reports/dashboard-summary');
      return ok(DashboardSummarySchema.parse(raw));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to load dashboard summary.'));
    }
  }

  public async getAdminDashboard(): Promise<Result<AdminDashboard, AppError>> {
    try {
      const raw = await this.http.get('/api/v1/Reports/admin-dashboard-summary');
      return ok(AdminDashboardSchema.parse(raw));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to load admin dashboard.'));
    }
  }

  public async getPopularBooks(limit = 5): Promise<Result<PopularBook[], AppError>> {
    try {
      const raw = await this.http.get(`/api/v1/Reports/popular-books?pageSize=${limit}`);
      const parsed = z.object({ items: z.array(PopularBookSchema) }).safeParse(raw);
      if (parsed.success) return ok(parsed.data.items);
      // API might return array directly
      return ok(z.array(PopularBookSchema).parse(raw));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to load popular books.'));
    }
  }

  public async getMemberProfileStats(memberId: string): Promise<Result<MemberProfileStats, AppError>> {
    try {
      const raw = await this.http.get(`/api/v1/Members/${memberId}/stats`);
      return ok(MemberProfileStatsSchema.parse(raw));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to load member stats.'));
    }
  }
}
