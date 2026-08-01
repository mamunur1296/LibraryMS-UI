// ============================================================
//  Logger port — the only sanctioned console wrapper.
//  Never call console.log/info directly; use this.
// ============================================================

export interface Logger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: unknown, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

export class ConsoleLogger implements Logger {
  public info(message: string, context?: Record<string, unknown>): void {
    console.warn(`[INFO] ${message}`, context ?? '');
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message}`, context ?? '');
  }

  public error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    console.error(`[ERROR] ${message}`, error ?? '', context ?? '');
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    if (import.meta.env.DEV) {
      console.warn(`[DEBUG] ${message}`, context ?? '');
    }
  }
}
