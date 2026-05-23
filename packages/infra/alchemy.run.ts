// biome-ignore-all lint/style/noNonNullAssertion: alchemy env vars are guaranteed present at deploy time
import alchemy from "alchemy";
import { D1Database, Vite, Worker } from "alchemy/cloudflare";
import { config } from "dotenv";

const isDeployLikeCommand = ["deploy", "destroy"].includes(
	process.env.npm_lifecycle_event ?? "",
);
const envFile = isDeployLikeCommand ? ".env.prod" : ".env.local";

// Load infra-local vars first (ALCHEMY_PASSWORD lives here)
config();
// App-specific env overrides infra defaults (fixes VITE_SERVER_URL in dev)
config({ path: `../../apps/web/${envFile}`, override: true });
config({ path: `../../apps/server/${envFile}`, override: true });

const app = await alchemy("zias", {
	password: process.env.ALCHEMY_PASSWORD,
});

const db = await D1Database("database", {
	migrationsDir: "../../packages/db/src/migrations",
});

export const web = await Vite("web", {
	cwd: "../../apps/web",
	assets: "dist",
	bindings: {
		VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL!,
	},
});

export const server = await Worker("server", {
	cwd: "../../apps/server",
	entrypoint: "src/index.ts",
	compatibility: "node",
	bindings: {
		DB: db,
		CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
		BETTER_AUTH_SECRET: isDeployLikeCommand
			? alchemy.secret.env.BETTER_AUTH_SECRET!
			: alchemy.env.BETTER_AUTH_SECRET!,
		BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
	},
	dev: {
		port: 3000,
	},
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

await app.finalize();
