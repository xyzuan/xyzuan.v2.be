import { Elysia } from "elysia";
import { z } from "zod";

const envValidateScheme = z.object({
  NODE_ENV: z.string(),
  DOMAIN: z.string(),
  DATABASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  LINKEDIN_CLIENT_ID: z.string(),
  LINKEDIN_CLIENT_SECRET: z.string(),
  TELEGRAM_CHAT_ID: z.string(),
  PASSWORD_PEPPER: z.string(),
});

const env = () => {
  const app = new Elysia({
    name: "env",
  });

  const env = envValidateScheme.parse(process.env);

  return app.decorate("env", {
    ...env,
    env: process.env,
  });
};

export { env };
