import type { HttpClient } from '@core/http';
import { DashboardHttpGateway } from './infrastructure/dashboard-http-gateway';
import {
  GetDashboardSummaryUseCase,
  GetAdminDashboardUseCase,
  GetPopularBooksUseCase,
  GetMemberProfileStatsUseCase,
} from './application';
import { setDashboardDeps } from './presentation/dashboard-deps';

export interface DashboardModuleDeps {
  readonly http: HttpClient;
}

/** Feature-level composition root. Wires all dashboard concretes. */
export function createDashboardModule(deps: DashboardModuleDeps): void {
  const dashboardGateway = new DashboardHttpGateway(deps.http);

  const getDashboardSummaryUseCase = new GetDashboardSummaryUseCase(dashboardGateway);
  const getAdminDashboardUseCase = new GetAdminDashboardUseCase(dashboardGateway);
  const getPopularBooksUseCase = new GetPopularBooksUseCase(dashboardGateway);
  const getMemberProfileStatsUseCase = new GetMemberProfileStatsUseCase(dashboardGateway);

  setDashboardDeps({
    getDashboardSummary: async () => {
      const result = await getDashboardSummaryUseCase.execute();
      if (result.isErr()) throw result.error;
      return result.value;
    },
    getAdminDashboard: async () => {
      const result = await getAdminDashboardUseCase.execute();
      if (result.isErr()) throw result.error;
      return result.value;
    },
    getPopularBooks: async () => {
      const result = await getPopularBooksUseCase.execute();
      if (result.isErr()) throw result.error;
      return result.value;
    },
    getMemberProfileStats: async (memberId: string) => {
      const result = await getMemberProfileStatsUseCase.execute(memberId);
      if (result.isErr()) throw result.error;
      return result.value;
    },
  });
}
