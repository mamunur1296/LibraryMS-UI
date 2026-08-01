import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthStore } from '../store/auth-store';

/** Redirects unauthenticated users to /login. */
export function ProtectedRoute(): React.ReactElement {
  const { session } = getAuthStore()();

  if (session === null || session.isExpired()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/** Redirects users that don't have the required role. */
export function RoleGuard({
  roles,
  fallback = '/dashboard',
}: {
  roles: string[];
  fallback?: string;
}): React.ReactElement {
  const { session } = getAuthStore()();

  if (session === null) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = roles.some((r) => session.hasRole(r));
  if (!hasRole) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
