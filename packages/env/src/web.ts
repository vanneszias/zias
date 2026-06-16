import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
    VITE_OG_URL: z.url().optional(),
  },
  // biome-ignore lint/suspicious/noExplicitAny: Vite's import.meta.env type is not exposed
  runtimeEnv: (import.meta as any).env,
  emptyStringAsUndefined: true,
});
