import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL deve ser uma URL valida"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET deve ter no minimo 16 caracteres"),
  JWT_REFRESH_SECRET: z.string().min(16).optional(),
  ADMIN_PASSWORD: z.string().min(6, "ADMIN_PASSWORD deve ter no minimo 6 caracteres"),
  GITHUB_USERNAME: z.string().optional().default("2jjj"),
  GITHUB_TOKEN: z.string().optional(),
  PORT: z.coerce.number().optional().default(3001),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).optional().default("info"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
  ALLOWED_ORIGINS: z.string().optional(),
});

let cachedEnv = null;

export function validateEnv() {
  if (cachedEnv) return cachedEnv;

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("[ENV] Variaveis de ambiente invalidas:");
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    return process.env;
  }

  cachedEnv = result.data;
  return cachedEnv;
}
