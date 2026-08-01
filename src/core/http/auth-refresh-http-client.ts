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
    return this.withAuth(() => this.inner.get<T>(url, options), options);
  }

  public async post<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.withAuth(() => this.inner.post<T>(url, body, options), options);
  }

  public async put<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.withAuth(() => this.inner.put<T>(url, body, options), options);
  }

  public async patch<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.withAuth(() => this.inner.patch<T>(url, body, options), options);
  }

  public async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.withAuth(() => this.inner.delete<T>(url, options), options);
  }

  private async withAuth<T>(fn: () => Promise<T>, options?: RequestOptions): Promise<T> {
    const token = this.tokenProvider.getAccessToken();
    if (token !== null) {
      this.injectToken(options, token);
    }

    try {
      return await fn();
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
        this.injectToken(options, newToken);
      }

      // Single retry
      try {
        return await fn();
      } catch (retryError) {
        if (retryError instanceof UnauthorizedError) {
          this.tokenProvider.clearSession();
        }
        throw retryError;
      }
    }
  }

  private injectToken(options: RequestOptions | undefined, token: string): void {
    if (options) {
      options.headers = { ...(options.headers ?? {}), Authorization: `Bearer ${token}` };
    }
  }
}
