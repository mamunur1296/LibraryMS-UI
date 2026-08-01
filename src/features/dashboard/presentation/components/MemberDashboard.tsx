import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, BookMarked, AlertTriangle, Clock, TrendingUp, DollarSign, Calendar, Heart } from 'lucide-react';
import { Card, Spinner } from '@shared/ui';
import { formatCurrency, formatNumber } from '@shared/utils';
import { useMemberStats } from '../use-dashboard';
import { StatCard } from './StatCard';
import type { StatItem } from './StatCard';

export function MemberDashboard({ memberId }: { memberId: string }): React.ReactElement {
  const memberStatsQuery = useMemberStats(memberId, true);

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
  );
}
