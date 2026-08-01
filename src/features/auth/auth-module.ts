import type { HttpClient } from '@core/http';
import { LoginUseCase } from './application/use-cases/login-use-case';
import { LogoutUseCase } from './application/use-cases/logout-use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token-use-case';
import { RegisterUseCase } from './application/use-cases/register-use-case';
import {
  GetProfileUseCase,
  UpdatePasswordUseCase,
  UpdateUsernameUseCase,
  UpdateEmailUseCase,
} from './application/use-cases/profile-use-cases';
import { AuthHttpGateway } from './infrastructure/auth-http-gateway';
import { ProfileHttpGateway } from './infrastructure/profile-http-gateway';
import { LocalSessionStore } from './infrastructure/local-session-store';
import { createAuthStore, setAuthStore } from './store/auth-store';

export interface AuthModuleDeps {
  readonly http: HttpClient;
}

export interface AuthModule {
  readonly loginUseCase: LoginUseCase;
  readonly logoutUseCase: LogoutUseCase;
  readonly refreshUseCase: RefreshTokenUseCase;
  readonly registerUseCase: RegisterUseCase;
  readonly getProfileUseCase: GetProfileUseCase;
  readonly updatePasswordUseCase: UpdatePasswordUseCase;
  readonly updateUsernameUseCase: UpdateUsernameUseCase;
  readonly updateEmailUseCase: UpdateEmailUseCase;
}

let _authModuleInstance: AuthModule | null = null;
export function setAuthModule(instance: AuthModule): void {
  _authModuleInstance = instance;
}
export function getAuthModule(): AuthModule {
  if (_authModuleInstance === null) throw new Error('AuthModule not initialized');
  return _authModuleInstance;
}

/** Feature-level composition root. Wires all auth concretes. */
export function createAuthModule(deps: AuthModuleDeps): AuthModule {
  const sessionStore = new LocalSessionStore();
  const authGateway = new AuthHttpGateway(deps.http);
  const profileGateway = new ProfileHttpGateway(deps.http);

  const loginUseCase = new LoginUseCase(authGateway, sessionStore);
  const logoutUseCase = new LogoutUseCase(authGateway, sessionStore);
  const refreshUseCase = new RefreshTokenUseCase(authGateway, sessionStore);
  const registerUseCase = new RegisterUseCase(authGateway);

  const initialSession = sessionStore.load();
  const store = createAuthStore({
    loginUseCase,
    logoutUseCase,
    refreshUseCase,
    registerUseCase,
    initialSession,
  });
  setAuthStore(store);

  const module: AuthModule = {
    loginUseCase,
    logoutUseCase,
    refreshUseCase,
    registerUseCase,
    getProfileUseCase: new GetProfileUseCase(profileGateway),
    updatePasswordUseCase: new UpdatePasswordUseCase(profileGateway),
    updateUsernameUseCase: new UpdateUsernameUseCase(profileGateway),
    updateEmailUseCase: new UpdateEmailUseCase(profileGateway),
  };
  setAuthModule(module);
  return module;
}
