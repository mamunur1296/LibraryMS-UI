import { FetchHttpClient, AuthRefreshHttpClient } from '@core/http';
import type { TokenProvider } from '@core/http';
import { appConfig } from '@core/config';
import { createAuthModule } from '@features/auth/auth-module';
import { getAuthStore } from '@features/auth/store/auth-store';
import { createDashboardModule } from '@features/dashboard/dashboard-module';
import { createBooksModule } from '@features/books/books-module';

// ============================================================
//  Composition Root — THE one place that wires all concretes.
//  Called once at application startup.
// ============================================================

let initialized = false;

export function initializeApp(): void {
  if (initialized) return;
  initialized = true;

  // ── 1. Token provider (reads from auth store, calls refresh) ──
  const tokenProvider: TokenProvider = {
    getAccessToken(): string | null {
      const store = getAuthStore();
      return store.getState().session?.accessToken ?? null;
    },

    async refresh(): Promise<boolean> {
      const store = getAuthStore();
      return store.getState().refresh();
    },

    clearSession(): void {
      const store = getAuthStore();
      store.getState().setSession(null);
    },
  };

  // ── 2. HTTP client decorator chain ──
  //    FetchHttpClient → AuthRefreshHttpClient
  const baseHttp = new FetchHttpClient(appConfig.apiBaseUrl);
  const authHttp = new AuthRefreshHttpClient(baseHttp, tokenProvider);

  // ── 3. Auth module (also bootstraps the auth Zustand store) ──
  createAuthModule({ http: authHttp });

  // ── 4. Dashboard module ──
  createDashboardModule({ http: authHttp });

  // ── 5. Books module ──
  createBooksModule({ http: authHttp });
}
