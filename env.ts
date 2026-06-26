import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BACKEND_API_URL: z.url(),
    NODE_ENV: z.enum(["development", "test", "production"])
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: z.string().min(1).optional(),
  },
  runtimeEnv: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_TELEGRAM_BOT_USERNAME:
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME,
  },
  emptyStringAsUndefined: true
});
