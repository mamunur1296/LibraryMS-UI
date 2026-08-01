// ============================================================
//  AuthSession — Aggregate root for the authenticated session.
//  Immutable: a "change" returns a new instance.
// ============================================================

export interface AuthSessionProps {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: Date;
  readonly userId: string;
  readonly username: string;
  readonly email: string;
  readonly role: string;
  readonly memberId: string | null;
  readonly branchId: string | null;
  readonly branchName: string | null;
}

export class AuthSession {
  public readonly accessToken: string;
  public readonly refreshToken: string;
  public readonly expiresAt: Date;
  public readonly userId: string;
  public readonly username: string;
  public readonly email: string;
  public readonly role: string;
  public readonly memberId: string | null;
  public readonly branchId: string | null;
  public readonly branchName: string | null;

  public constructor(props: AuthSessionProps) {
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
    this.expiresAt = props.expiresAt;
    this.userId = props.userId;
    this.username = props.username;
    this.email = props.email;
    this.role = props.role;
    this.memberId = props.memberId;
    this.branchId = props.branchId;
    this.branchName = props.branchName;
  }

  public isExpired(): boolean {
    return new Date() >= this.expiresAt;
  }

  public hasRole(role: string): boolean {
    return this.role.toLowerCase() === role.toLowerCase();
  }

  public isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  public isLibrarian(): boolean {
    return this.hasRole('Librarian');
  }

  public isMember(): boolean {
    return this.hasRole('Member');
  }

  public isAdminOrLibrarian(): boolean {
    return this.isAdmin() || this.isLibrarian();
  }

  public withTokens(accessToken: string, refreshToken: string, expiresAt: Date): AuthSession {
    return new AuthSession({
      accessToken,
      refreshToken,
      expiresAt,
      userId: this.userId,
      username: this.username,
      email: this.email,
      role: this.role,
      memberId: this.memberId,
      branchId: this.branchId,
      branchName: this.branchName,
    });
  }
}
