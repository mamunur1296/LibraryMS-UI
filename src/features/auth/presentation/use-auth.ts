import { getAuthStore } from '../store/auth-store';
import type { AuthSession } from '../domain/entities/auth-session';
import type { AuthActions } from '../store/auth-store';

export interface UseAuthReturn {
  readonly session: AuthSession | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly isAdmin: boolean;
  readonly isLibrarian: boolean;
  readonly isMember: boolean;
  readonly login: AuthActions['login'];
  readonly logout: AuthActions['logout'];
  readonly refresh: AuthActions['refresh'];
  readonly register: AuthActions['register'];
}

/** Hook: exposes auth state and actions. Use this in all presentation components. */
export function useAuth(): UseAuthReturn {
  const useAuthStore = getAuthStore();
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const refresh = useAuthStore((s) => s.refresh);
  const register = useAuthStore((s) => s.register);

  return {
    session,
    isAuthenticated: session !== null && !session.isExpired(),
    isLoading,
    isAdmin: session?.isAdmin() ?? false,
    isLibrarian: session?.isLibrarian() ?? false,
    isMember: session?.isMember() ?? false,
    login,
    logout,
    refresh,
    register,
  };
}
