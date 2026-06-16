import { env } from "@zias/env/web";

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

export const serverBaseUrl = trimTrailingSlash(env.VITE_SERVER_URL);
export const ogBaseUrl = trimTrailingSlash(
  env.VITE_OG_URL ?? env.VITE_SERVER_URL,
);
