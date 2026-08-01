import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Users,
  BookMarked,
  AlertTriangle,
  Clock,
  Building2,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Calendar,
  Heart,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@features/auth';
import { Card, CardHeader, CardTitle, Badge, Spinner } from '@shared/ui';
import { formatCurrency, formatNumber } from '@shared/utils';
import type { DashboardSummary, AdminDashboard, PopularBook, MemberProfileStats } from '../infrastructure/dashboard-http-gateway';

// ─── Types injected by composition root ────────────────────
export interface DashboardDeps {
  getDashboardSummary: () => Promise<DashboardSummary>;
  getAdminDashboard: () => Promise<AdminDashboard>;
  getPopularBooks: () => Promise<PopularBook[]>;
  getMemberProfileStats: (memberId: string) => Promise<MemberProfileStats>;
}

let _dashboardDeps: DashboardDeps | null = null;
export function setDashboardDeps(deps: DashboardDeps): void {
  _dashboardDeps = deps;
}

// ─── Stat Card ──────────────────────────────────────────────
interface StatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  change?: string;
}

function StatCard({ stat }: { stat: StatItem }): React.ReactElement {
  const Icon = stat.icon;
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card padding="md" className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${stat.bgColor} shrink-0`}>
          <Icon className={`h-6 w-6 ${stat.color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-0.5">{stat.value}</p>
          {stat.change !== undefined && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stat.change}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Main Dashboard Page ────────────────────────────────────
export function DashboardPage(): React.ReactElement {
  const { session, isAdmin, isLibrarian, isMember } = useAuth();

  const isStaff = isAdmin || isLibrarian;

  const summaryQuery = useQuery({
    queryKey: ['dashboard-summary', session?.userId],
    queryFn: async (): Promise<DashboardSummary> => {
      if (_dashboardDeps === null) throw new Error('DashboardDeps not initialized');
      return _dashboardDeps.getDashboardSummary();
    },
    enabled: isStaff,
    staleTime: 60_000,
    retry: 1,
  });

  const adminQuery = useQuery({
    queryKey: ['admin-dashboard', session?.userId],
    queryFn: async (): Promise<AdminDashboard> => {
      if (_dashboardDeps === null) throw new Error('DashboardDeps not initialized');
      return _dashboardDeps.getAdminDashboard();
    },
    enabled: isAdmin,
    staleTime: 60_000,
  });

  const popularQuery = useQuery({
    queryKey: ['popular-books', session?.userId],
    queryFn: async (): Promise<PopularBook[]> => {
      if (_dashboardDeps === null) throw new Error('DashboardDeps not initialized');
      return _dashboardDeps.getPopularBooks();
    },
    enabled: isStaff,
    staleTime: 120_000,
  });

  const memberStatsQuery = useQuery({
    queryKey: ['member-stats', session?.memberId],
    queryFn: async (): Promise<MemberProfileStats> => {
      if (_dashboardDeps === null) throw new Error('DashboardDeps not initialized');
      if (!session?.memberId) throw new Error('No member ID in session');
      return _dashboardDeps.getMemberProfileStats(session.memberId);
    },
    enabled: isMember,
    staleTime: 60_000,
  });

  const summary = summaryQuery.data;

  const stats: StatItem[] = summary !== undefined
    ? [
        {
          label: 'Total Books',
          value: formatNumber(summary.totalBooks),
          icon: BookOpen,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          label: 'Total Members',
          value: formatNumber(summary.totalMembers),
          icon: Users,
          color: 'text-violet-600',
          bgColor: 'bg-violet-50',
        },
        {
          label: 'Active Borrows',
          value: formatNumber(summary.activeBorrows),
          icon: BookMarked,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
        },
        {
          label: 'Overdue',
          value: formatNumber(summary.overdueBorrows),
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
        },
        {
          label: 'Reservations',
          value: formatNumber(summary.pendingReservations),
          icon: Clock,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
        },
        {
          label: 'Branches',
          value: formatNumber(summary.totalBranches),
          icon: Building2,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
        },
        {
          label: 'Fines Collected',
          value: formatCurrency(summary.totalLateFinesCollected, 'BDT'),
          icon: DollarSign,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        },
        {
          label: 'Pending Fines',
          value: formatCurrency(summary.pendingLateFines, 'BDT'),
          icon: TrendingUp,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
        },
      ]
    : [];

  const memberStats: StatItem[] = memberStatsQuery.data !== undefined
    ? [
        {
          label: 'Total Borrows',
          value: formatNumber(memberStatsQuery.data.totalBorrows),
          icon: BookOpen,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          label: 'Active Borrows',
          value: formatNumber(memberStatsQuery.data.activeBorrows),
          icon: BookMarked,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
        },
        {
          label: 'Overdue',
          value: formatNumber(memberStatsQuery.data.overdueBorrows),
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
        },
        {
          label: 'Reservations',
          value: formatNumber(memberStatsQuery.data.activeReservations),
          icon: Clock,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
        },
        {
          label: 'Fines Due',
          value: formatCurrency(memberStatsQuery.data.totalFinesDue, 'BDT'),
          icon: TrendingUp,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
        },
        {
          label: 'Fines Paid',
          value: formatCurrency(memberStatsQuery.data.totalFinesPaid, 'BDT'),
          icon: DollarSign,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        },
        {
          label: 'Expiry Date',
          value: new Date(memberStatsQuery.data.membershipExpiry).toLocaleDateString(),
          icon: Calendar,
          color: 'text-violet-600',
          bgColor: 'bg-violet-50',
        },
        {
          label: 'Nearest Due Date',
          value: memberStatsQuery.data.nearestDueDate 
            ? new Date(memberStatsQuery.data.nearestDueDate).toLocaleDateString()
            : 'N/A',
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          label: 'Favourites',
          value: formatNumber(memberStatsQuery.data.favouriteCount),
          icon: Heart,
          color: 'text-pink-600',
          bgColor: 'bg-pink-50',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Good {getGreeting()}, {session?.username ?? 'Admin'} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Here&apos;s what&apos;s happening in your library today.
          </p>
        </div>
        <button
          onClick={() => {
            void summaryQuery.refetch();
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          aria-label="Refresh dashboard"
        >
          <RefreshCw className={`h-4 w-4 ${summaryQuery.isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats grid (Staff only) */}
      {isStaff && (
        summaryQuery.isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="lg" />
          </div>
        ) : summaryQuery.isError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            Failed to load dashboard data. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <StatCard stat={stat} />
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Member Dashboard */}
      {isMember && (
        <div className="space-y-6">
          {memberStatsQuery.isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Spinner size="lg" />
            </div>
          ) : memberStatsQuery.isError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              Failed to load your stats. Please try again.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {memberStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <StatCard stat={stat} />
                </motion.div>
              ))}
            </div>
          )}

          <Card padding="lg" className="bg-gradient-to-br from-white to-amber-50 border-amber-100">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to LibraryMS!</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Browse our extensive collection of books, make reservations for upcoming reads, and track your active borrows all from your dashboard.
              </p>
              <div className="flex gap-4">
                <a href="/books" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors shadow-sm shadow-amber-500/20">
                  Browse Books
                </a>
                <a href="/borrows" className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 transition-colors">
                  My Borrows
                </a>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Books (Staff only) */}
        {isStaff && (
          <Card padding="none">
            <CardHeader className="px-6 pt-5 pb-0">
              <CardTitle>🔥 Popular Books</CardTitle>
            </CardHeader>
            {popularQuery.isLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
              <div className="divide-y divide-slate-50">
                {(popularQuery.data ?? []).slice(0, 5).map((book, i) => (
                  <div key={book.bookId} className="flex items-center gap-3 px-6 py-3">
                    <span className="w-6 h-6 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{book.title}</p>
                      <p className="text-xs text-slate-500 truncate">{book.authorName} · {book.categoryName}</p>
                    </div>
                    <Badge variant="info">{book.totalBorrows}×</Badge>
                  </div>
                ))}
                {(popularQuery.data ?? []).length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-8">No data available</p>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Branch Summary (Admin only) */}
        {isAdmin && (
          <Card padding="none">
            <CardHeader className="px-6 pt-5 pb-0">
              <CardTitle>🏢 Branch Performance</CardTitle>
            </CardHeader>
            {adminQuery.isLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
              <div className="divide-y divide-slate-50">
                {(adminQuery.data?.branchSummaries ?? []).map((branch) => (
                  <div key={branch.branchId} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{branch.branchName}</p>
                      <p className="text-xs text-slate-500">
                        {branch.totalMembers} members · {branch.activeBorrows} active borrows
                      </p>
                    </div>
                    <div className="text-right">
                      {branch.overdueBorrows > 0 ? (
                        <Badge variant="danger">{branch.overdueBorrows} overdue</Badge>
                      ) : (
                        <Badge variant="success">All good</Badge>
                      )}
                    </div>
                  </div>
                ))}
                {(adminQuery.data?.branchSummaries ?? []).length === 0 && !adminQuery.isLoading && (
                  <p className="text-center text-slate-400 text-sm py-8">No branch data</p>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Librarian: show summary card */}
        {isLibrarian && !isAdmin && (
          <Card padding="md">
            <CardHeader>
              <CardTitle>🏢 Your Branch</CardTitle>
            </CardHeader>
            <p className="text-sm text-slate-500">
              Branch: <span className="font-semibold text-slate-700">{session?.branchName ?? '—'}</span>
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
