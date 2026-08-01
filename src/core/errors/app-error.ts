// ============================================================
//  AppError hierarchy
//  Never throw new Error('...') — throw a typed AppError subclass.
//  Expected failures are values: return Result<T, AppError>.
// ============================================================

export type ErrorCode = string;

/** Base class for all application errors. */
export abstract class AppError extends Error {
  public abstract readonly code: ErrorCode;

  public constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/** Validation / business rule violation. */
export class DomainError extends AppError {
  public readonly code: ErrorCode;

  public constructor(message: string, code: ErrorCode = 'DOMAIN_ERROR') {
    super(message, 422);
    this.code = code;
  }
}

/** HTTP 400 */
export class BadRequestError extends AppError {
  public readonly code = 'BAD_REQUEST' as const;

  public constructor(message = 'Bad request') {
    super(message, 400);
  }
}

/** HTTP 401 */
export class UnauthorizedError extends AppError {
  public readonly code = 'UNAUTHORIZED' as const;

  public constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/** HTTP 403 */
export class ForbiddenError extends AppError {
  public readonly code = 'FORBIDDEN' as const;

  public constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/** HTTP 404 */
export class NotFoundError extends AppError {
  public readonly code = 'NOT_FOUND' as const;

  public constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

/** Network / connectivity failure. */
export class NetworkError extends AppError {
  public readonly code = 'NETWORK_ERROR' as const;

  public constructor(message = 'Network error. Please check your connection.') {
    super(message);
  }
}

/** Unexpected server error (5xx). */
export class ServerError extends AppError {
  public readonly code = 'SERVER_ERROR' as const;

  public constructor(message = 'An unexpected server error occurred.', statusCode = 500) {
    super(message, statusCode);
  }
}

/** Request timed out. */
export class TimeoutError extends AppError {
  public readonly code = 'TIMEOUT' as const;

  public constructor(message = 'The request timed out.') {
    super(message);
  }
}
