// ============================================================
//  HttpClient port — the domain's contract for HTTP calls.
//  Features depend only on this interface; the concrete
//  implementation (FetchHttpClient + decorators) lives in
//  infrastructure / composition-root.
// ============================================================

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface HttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<T>;
  post<T>(url: string, body: unknown, options?: RequestOptions): Promise<T>;
  put<T>(url: string, body: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(url: string, body: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(url: string, options?: RequestOptions): Promise<T>;
}
