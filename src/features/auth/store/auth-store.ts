import { create, type StoreApi, type UseBoundStore } from 'zustand';
import type { AuthSession } from '../domain/entities/auth-session';
import type { LoginUseCase } from '../application/use-cases/login-use-case';
import type { LogoutUseCase } from '../application/use-cases/logout-use-case';
import type { RefreshTokenUseCase } from '../application/use-cases/refresh-token-use-case';
import type { RegisterUseCase } from '../application/use-cases/register-use-case';
import type { AppError } from '@core/errors';

export interface AuthState {
  readonly session: AuthSession | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

export interface AuthActions {
  readonly login: (username: string, password: string) => Promise<AppError | null>;
  readonly logout: () => Promise<void>;
  readonly refresh: () => Promise<boolean>;
  readonly register: (username: string, email: string, password: string) => Promise<AppError | null>;
  readonly setSession: (session: AuthSession | null) => void;
  readonly clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

export interface AuthStoreDeps {
  readonly loginUseCase: LoginUseCase;
  readonly logoutUseCase: LogoutUseCase;
  readonly refreshUseCase: RefreshTokenUseCase;
  readonly registerUseCase: RegisterUseCase;
  readonly initialSession: AuthSession | null;
}

export function createAuthStore(deps: AuthStoreDeps): UseBoundStore<StoreApi<AuthStore>> {
  return create<AuthStore>()((set) => ({
    // ── State ──
    session: deps.initialSession,
    isLoading: false,
    error: null,

    // ── Actions ──
    setSession: (session) => set({ session }),

    clearError: () => set({ error: null }),

    login: async (username, password) => {
      set({ isLoading: true, error: null });
      const result = await deps.loginUseCase.execute({ username, password });
      if (result.isErr()) {
        set({ isLoading: false, error: result.error.message });
        return result.error;
      }
      set({ session: result.value, isLoading: false });
      return null;
    },

    logout: async () => {
      set({ isLoading: true });
      await deps.logoutUseCase.execute();
      set({ session: null, isLoading: false, error: null });
    },

    refresh: async () => {
      const result = await deps.refreshUseCase.execute();
      if (result.isErr()) {
        set({ session: null });
        return false;
      }
      set({ session: result.value });
      return true;
    },

    register: async (username, email, password) => {
      set({ isLoading: true, error: null });
      const result = await deps.registerUseCase.execute({ username, email, password });
      set({ isLoading: false });
      if (result.isErr()) {
        set({ error: result.error.message });
        return result.error;
      }
      return null;
    },
  }));
}

/** The singleton store instance — set by auth-module.ts in the composition root. */
let _authStore: UseBoundStore<StoreApi<AuthStore>> | null = null;

export function setAuthStore(store: UseBoundStore<StoreApi<AuthStore>>): void {
  _authStore = store;
}

export function getAuthStore(): UseBoundStore<StoreApi<AuthStore>> {
  if (_authStore === null) throw new Error('AuthStore not initialized');
  return _authStore;
}
