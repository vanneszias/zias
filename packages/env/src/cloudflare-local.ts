import { config } from "dotenv";

config({ path: `${import.meta.dir}/../../../.env.local` });
config();

const runtimeEnv = typeof process === "undefined" ? {} : process.env;

export const env = new Proxy({} as Env, {
  get(_target, prop) {
    if (typeof prop !== "string") {
      return undefined;
    }

    return runtimeEnv[prop];
  },
});
