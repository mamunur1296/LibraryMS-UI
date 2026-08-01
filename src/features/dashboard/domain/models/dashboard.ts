export interface DashboardSummary {
  totalBooks: number;
  totalMembers: number;
  activeBorrows: number;
  overdueBorrows: number;
  pendingReservations: number;
  totalBranches: number;
  totalLateFinesCollected: number;
  pendingLateFines: number;
}

export interface BranchSummary {
  branchId: string;
  branchName: string;
  totalBooks: number;
  totalMembers: number;
  activeBorrows: number;
  overdueBorrows: number;
  totalRevenue: number;
}

export interface AdminDashboard {
  totalSummary: DashboardSummary;
  branchSummaries: BranchSummary[];
}

export interface PopularBook {
  bookId: string;
  title: string;
  authorName: string;
  categoryName: string;
  totalBorrows: number;
}

export interface MemberProfileStats {
  memberId: string;
  totalBorrows: number;
  activeBorrows: number;
  overdueBorrows: number;
  activeReservations: number;
  totalFinesDue: number;
  totalFinesPaid: number;
  membershipExpiry: string;
  nearestDueDate: string | null;
  favouriteCount: number;
}
