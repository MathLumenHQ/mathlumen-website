import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL URL"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid PostgreSQL URL").optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL").optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NEXT_PUBLIC_SITE_NAME: z.string().min(1, "NEXT_PUBLIC_SITE_NAME is required"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables.
 * Fails fast at import time with a clear error message if validation fails.
 */
function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Environment validation failed:\n${formatted}\n\nCheck your .env file against .env.example.`
    );
  }

  return result.data;
}

export const env = validateEnv();
