import { err, ok } from '@core/result';
import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import { ServerError } from '@core/errors';
import { z } from 'zod';
import type { HttpClient } from '@core/http';

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

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
export type BranchSummary = z.infer<typeof BranchSummarySchema>;
export type AdminDashboard = z.infer<typeof AdminDashboardSchema>;
export type PopularBook = z.infer<typeof PopularBookSchema>;

export class DashboardHttpGateway {
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
}
