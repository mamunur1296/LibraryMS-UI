import { z } from 'zod';

// ============================================================
//  Auth DTOs — Zod schemas validate the wire format from the API.
//  These shapes NEVER leak into domain/application layers.
// ============================================================

export const UserDtoSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  isActive: z.boolean(),
  memberId: z.string().nullable().optional(),
  branchId: z.string().nullable().optional(),
  branchName: z.string().nullable().optional(),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.string(),
  user: UserDtoSchema,
});

export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export const RevokeTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export const RegisterRequestSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
