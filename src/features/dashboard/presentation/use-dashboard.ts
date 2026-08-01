import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboardDeps } from './dashboard-deps';
import type { DashboardSummary, AdminDashboard, PopularBook, MemberProfileStats } from '../domain/models/dashboard';

/**
 * Custom hooks for Dashboard feature data fetching.
 * Abstracts TanStack Query and dependency injection away from UI components.
 */

export function useDashboardSummary(userId: string | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ['dashboard-summary', userId],
    queryFn: async (): Promise<DashboardSummary> => {
      return getDashboardDeps().getDashboardSummary();
    },
    enabled: enabled && userId !== undefined,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useAdminDashboard(userId: string | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ['admin-dashboard', userId],
    queryFn: async (): Promise<AdminDashboard> => {
      return getDashboardDeps().getAdminDashboard();
    },
    enabled: enabled && userId !== undefined,
    staleTime: 60_000,
  });
}

export function usePopularBooks(userId: string | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ['popular-books', userId],
    queryFn: async (): Promise<PopularBook[]> => {
      return getDashboardDeps().getPopularBooks();
    },
    enabled: enabled && userId !== undefined,
    staleTime: 120_000,
  });
}

export function useMemberStats(memberId: string | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ['member-stats', memberId],
    queryFn: async (): Promise<MemberProfileStats> => {
      if (!memberId) throw new Error('No member ID');
      return getDashboardDeps().getMemberProfileStats(memberId);
    },
    enabled: enabled && memberId !== undefined,
    staleTime: 60_000,
  });
}

export function useDashboardRefresh() {
  const queryClient = useQueryClient();
  
  return () => {
    void queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    void queryClient.invalidateQueries({ queryKey: ['popular-books'] });
    void queryClient.invalidateQueries({ queryKey: ['member-stats'] });
  };
}
