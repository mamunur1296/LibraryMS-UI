// ============================================================
//  AuthRefreshHttpClient — decorator that:
//  1. Injects the Authorization: Bearer <token> header.
//  2. On 401: attempts a token refresh, then retries once.
//  3. On second 401: clears the session (forces logout).
// ============================================================

import { UnauthorizedError } from '@core/errors';
import type { HttpClient, RequestOptions } from './http-client';

export interface TokenProvider {
  getAccessToken(): string | null;
  refresh(): Promise<boolean>;
  clearSession(): void;
}

export class AuthRefreshHttpClient implements HttpClient {
  public constructor(
    private readonly inner: HttpClient,
    private readonly tokenProvider: TokenProvider,
  ) {}

  public async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.withAuth((opts) => this.inner.get<T>(url, opts), options);
  }

  public async post<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.withAuth((opts) => this.inner.post<T>(url, body, opts), options);
  }

  public async put<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.withAuth((opts) => this.inner.put<T>(url, body, opts), options);
  }

  public async patch<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.withAuth((opts) => this.inner.patch<T>(url, body, opts), options);
  }

  public async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.withAuth((opts) => this.inner.delete<T>(url, opts), options);
  }

  private async withAuth<T>(
    fn: (opts?: RequestOptions) => Promise<T>,
    options?: RequestOptions,
  ): Promise<T> {
    let opts = options ? { ...options } : {};
    const token = this.tokenProvider.getAccessToken();
    if (token !== null) {
      opts.headers = { ...(opts.headers ?? {}), Authorization: `Bearer ${token}` };
    }

    try {
      return await fn(opts);
    } catch (error) {
      if (!(error instanceof UnauthorizedError)) {
        throw error;
      }

      // 401 → try to refresh
      const refreshed = await this.tokenProvider.refresh();
      if (!refreshed) {
        this.tokenProvider.clearSession();
        throw error;
      }

      const newToken = this.tokenProvider.getAccessToken();
      if (newToken !== null) {
        opts.headers = { ...(opts.headers ?? {}), Authorization: `Bearer ${newToken}` };
      }

      // Single retry
      try {
        return await fn(opts);
      } catch (retryError) {
        if (retryError instanceof UnauthorizedError) {
          this.tokenProvider.clearSession();
        }
        throw retryError;
      }
    }
  }
}
