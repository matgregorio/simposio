import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  COOKIE_DOMAIN: z.string().default('localhost'),
  CSRF_SECRET: z.string().min(16),
  STORAGE_DIR: z.string().default('./storage'),
  MAIL_HOST: z.string().default('localhost'),
  MAIL_PORT: z.coerce.number().default(1025),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
});

const testDefaults = {
  MONGO_URI: 'mongodb://127.0.0.1:27017/simposio-test',
  JWT_SECRET: 'test-jwt-secret-simposio-1234567890abcd',
  JWT_REFRESH_SECRET: 'test-refresh-secret-simposio-0987654321abcd',
  CSRF_SECRET: 'test-csrf-secret-123456',
};

const env = envSchema.parse(
  process.env.NODE_ENV === 'test' ? { ...testDefaults, ...process.env } : process.env,
);

export default env;
