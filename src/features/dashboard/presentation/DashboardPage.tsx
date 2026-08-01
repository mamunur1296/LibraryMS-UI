import React from 'react';
import { useAuth } from '@features/auth';
import { RefreshCw } from 'lucide-react';
import { MemberDashboard } from './components/MemberDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { useDashboardRefresh } from './use-dashboard';

export function DashboardPage(): React.ReactElement {
  const { session, isAdmin, isLibrarian, isMember } = useAuth();
  const handleRefresh = useDashboardRefresh();
  const isStaff = isAdmin || isLibrarian;

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
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          aria-label="Refresh dashboard"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {isStaff && (
        <StaffDashboard 
          userId={session?.userId} 
          isAdmin={isAdmin} 
          isLibrarian={isLibrarian} 
          branchName={session?.branchName ?? undefined} 
        />
      )}

      {isMember && session?.memberId && (
        <MemberDashboard memberId={session.memberId} />
      )}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
