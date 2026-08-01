import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, BookMarked, AlertTriangle, Clock, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge, Spinner } from '@shared/ui';
import { formatCurrency, formatNumber } from '@shared/utils';
import { useDashboardSummary, useAdminDashboard, usePopularBooks } from '../use-dashboard';
import { StatCard } from './StatCard';
import type { StatItem } from './StatCard';

interface StaffDashboardProps {
  userId?: string | undefined;
  isAdmin: boolean;
  isLibrarian: boolean;
  branchName?: string | undefined;
}

export function StaffDashboard({ userId, isAdmin, isLibrarian, branchName }: StaffDashboardProps): React.ReactElement {
  const summaryQuery = useDashboardSummary(userId, true);
  const adminQuery = useAdminDashboard(userId, isAdmin);
  const popularQuery = usePopularBooks(userId, true);

  const summary = summaryQuery.data;

  const stats: StatItem[] = summary !== undefined
    ? [
        { label: 'Total Books', value: formatNumber(summary.totalBooks), icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Total Members', value: formatNumber(summary.totalMembers), icon: Users, color: 'text-violet-600', bgColor: 'bg-violet-50' },
        { label: 'Active Borrows', value: formatNumber(summary.activeBorrows), icon: BookMarked, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { label: 'Overdue', value: formatNumber(summary.overdueBorrows), icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
        { label: 'Reservations', value: formatNumber(summary.pendingReservations), icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
        { label: 'Branches', value: formatNumber(summary.totalBranches), icon: Building2, color: 'text-teal-600', bgColor: 'bg-teal-50' },
        { label: 'Fines Collected', value: formatCurrency(summary.totalLateFinesCollected, 'BDT'), icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50' },
        { label: 'Pending Fines', value: formatCurrency(summary.pendingLateFines, 'BDT'), icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {summaryQuery.isLoading ? (
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {isLibrarian && !isAdmin && (
          <Card padding="md">
            <CardHeader>
              <CardTitle>🏢 Your Branch</CardTitle>
            </CardHeader>
            <p className="text-sm text-slate-500">
              Branch: <span className="font-semibold text-slate-700">{branchName ?? '—'}</span>
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
