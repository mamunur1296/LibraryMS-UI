import type { DashboardSummary, AdminDashboard, PopularBook, MemberProfileStats } from '../domain/models/dashboard';

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

export function getDashboardDeps(): DashboardDeps {
  if (_dashboardDeps === null) throw new Error('DashboardDeps not initialized');
  return _dashboardDeps;
}
