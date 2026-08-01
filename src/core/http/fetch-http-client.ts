// ============================================================
//  FetchHttpClient — concrete HttpClient over the native Fetch API.
//  Parses JSON responses and maps HTTP errors to typed AppErrors.
// ============================================================

import {
  BadRequestError,
  DomainError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
} from '@core/errors';
import type { HttpClient, RequestOptions } from './http-client';

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export class FetchHttpClient implements HttpClient {
  public constructor(private readonly baseUrl: string) {}

  public async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  public async post<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', url, body, options);
  }

  public async put<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', url, body, options);
  }

  public async patch<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', url, body, options);
  }

  public async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  private async request<T>(
    method: string,
    url: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    const headers = { ...DEFAULT_HEADERS, ...(options?.headers ?? {}) };

    const init: RequestInit = {
      method,
      headers,
    };
    if (body !== undefined) {
      init.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    if (options?.signal !== undefined) {
      init.signal = options.signal;
    }

    const response = await fetch(fullUrl, init).catch(() => {
      throw new NetworkError();
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    const json = await response.json();
    
    // Unwrap the standard backend response wrapper if present
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return json.data as T;
    }
    
    return json as T;
  }

  private async handleError(response: Response): Promise<never> {
    let message = response.statusText;
    let validationErrors: Record<string, string[]> | undefined = undefined;

    try {
      const body = (await response.json()) as { message?: string; title?: string; errors?: Record<string, string[]> };
      message = body.message ?? body.title ?? message;
      if (body.errors) {
        validationErrors = body.errors;
      }
    } catch {
      // ignore JSON parse error — use status text
    }

    switch (response.status) {
      case 400:
        throw new BadRequestError(message, validationErrors);
      case 401:
        throw new UnauthorizedError(message);
      case 403:
        throw new ForbiddenError(message);
      case 404:
        throw new NotFoundError(message);
      case 422:
        throw new DomainError(message, 'DOMAIN_ERROR', validationErrors);
      default:
        throw new ServerError(message, response.status);
    }
  }
}
