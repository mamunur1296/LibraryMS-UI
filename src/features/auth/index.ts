// Public API of the auth feature — import ONLY from here
export { useAuth } from './presentation/use-auth';
export { ProtectedRoute, RoleGuard } from './presentation/ProtectedRoute';
export { createAuthModule } from './auth-module';
export type { AuthModule, AuthModuleDeps } from './auth-module';
