import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@features/auth';
import { AppShell } from '../shell/AppShell';
import { Spinner } from '@shared/ui';

// Lazy load pages for code splitting
const LoginPage = lazy(() =>
  import('@features/auth/presentation/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@features/auth/presentation/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const ProfileSettings = lazy(() =>
  import('@features/auth/presentation/ProfileSettings').then((m) => ({ default: m.ProfileSettings })),
);
const DashboardPage = lazy(() =>
  import('@features/dashboard/presentation/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
);

function PageLoader(): React.ReactElement {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner size="lg" />
    </div>
  );
}

export function AppRouter(): React.ReactElement {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected routes — wrapped in AppShell */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfileSettings />} />
              
              {/* Future pages go here */}
              <Route path="/books" element={<ComingSoon title="Books" />} />
              <Route path="/members" element={<ComingSoon title="Members" />} />
              <Route path="/borrows" element={<ComingSoon title="Borrows" />} />
              <Route path="/reservations" element={<ComingSoon title="Reservations" />} />
              <Route path="/branches" element={<ComingSoon title="Branches" />} />
              <Route path="/users" element={<ComingSoon title="User Management" />} />
              <Route path="/reports" element={<ComingSoon title="Reports" />} />
            </Route>
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function ComingSoon({ title }: { title: string }): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="text-5xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-slate-700">{title}</h2>
      <p className="text-slate-400 mt-2">This page is coming soon.</p>
    </div>
  );
}
