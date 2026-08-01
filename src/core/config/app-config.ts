import { z } from 'zod';

// ============================================================
//  AppConfig — Zod-validated, typed environment variables.
//  Nothing reads import.meta.env directly; always use appConfig.
// ============================================================

const AppConfigSchema = z.object({
  apiBaseUrl: z.string().min(1, 'VITE_API_BASE_URL is required'),
  isDev: z.boolean(),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

function createConfig(): AppConfig {
  const parsed = AppConfigSchema.safeParse({
    apiBaseUrl: import.meta.env['VITE_API_BASE_URL'] as string,
    isDev: import.meta.env.DEV as boolean,
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment configuration:\n${parsed.error.message}`);
  }

  return parsed.data;
}

export const appConfig: AppConfig = createConfig();
