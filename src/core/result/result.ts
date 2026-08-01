// ============================================================
//  Result<T, E> — Railway-oriented error handling
//  Never throw for expected failures; return a typed Result.
// ============================================================

import type { AppError } from '@core/errors';

/** Discriminated union: every operation that can fail returns this. */
export type Result<T, E = AppError> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  public readonly ok = true as const;

  public constructor(public readonly value: T) {}

  public isOk(): this is Ok<T, E> {
    return true;
  }

  public isErr(): this is Err<T, E> {
    return false;
  }
}

export class Err<T, E> {
  public readonly ok = false as const;

  public constructor(public readonly error: E) {}

  public isOk(): this is Ok<T, E> {
    return false;
  }

  public isErr(): this is Err<T, E> {
    return true;
  }
}

/** Convenience constructors */
export const ok = <T, E = AppError>(value: T): Result<T, E> => new Ok<T, E>(value);
export const err = <T, E = AppError>(error: E): Result<T, E> => new Err<T, E>(error);
