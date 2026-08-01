import { z } from 'zod';

export const DashboardSummarySchema = z.object({
  totalBooks: z.number(),
  totalMembers: z.number(),
  activeBorrows: z.number(),
  overdueBorrows: z.number(),
  pendingReservations: z.number(),
  totalBranches: z.number(),
  totalLateFinesCollected: z.number(),
  pendingLateFines: z.number(),
});

export const BranchSummarySchema = z.object({
  branchId: z.string(),
  branchName: z.string(),
  totalBooks: z.number(),
  totalMembers: z.number(),
  activeBorrows: z.number(),
  overdueBorrows: z.number(),
  totalRevenue: z.number(),
});

export const AdminDashboardSchema = z.object({
  totalSummary: DashboardSummarySchema,
  branchSummaries: z.array(BranchSummarySchema),
});

export const PopularBookSchema = z.object({
  bookId: z.string(),
  title: z.string(),
  authorName: z.string(),
  categoryName: z.string(),
  totalBorrows: z.number(),
});

export const MemberProfileStatsSchema = z.object({
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
