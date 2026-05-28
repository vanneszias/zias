// biome-ignore-all lint/style/noNonNullAssertion: alchemy env vars are guaranteed present at deploy time
import alchemy from "alchemy";
import { D1Database, R2Bucket, Vite, Worker } from "alchemy/cloudflare";
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

const databaseName = "zias-database-zias";
const ogImagesBucketName = "zias-og-images-zias";
const webWorkerName = "zias-web-zias";
const serverWorkerName = "zias-server-zias";
const ogWorkerName = "zias-og-zias";

const db = await D1Database("database", {
	name: databaseName,
	adopt: true,
	delete: false,
	dev: {
		remote: false,
	},
	migrationsDir: "../../packages/db/src/migrations",
});

const ogImages = await R2Bucket("og-images", {
	name: ogImagesBucketName,
	adopt: true,
	delete: false,
	dev: {
		remote: false,
	},
	devDomain: false,
});

export const web = await Vite("web", {
	name: webWorkerName,
	adopt: true,
	delete: false,
	cwd: "../../apps/web",
	assets: "dist",
	bindings: {
		VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL!,
		VITE_OG_URL: alchemy.env.VITE_OG_URL ?? alchemy.env.VITE_SERVER_URL!,
	},
});

export const server = await Worker("server", {
	name: serverWorkerName,
	adopt: true,
	delete: false,
	cwd: "../../apps/server",
	entrypoint: "src/index.ts",
	compatibility: "node",
	bindings: {
		DB: db,
		OG_IMAGES: ogImages,
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

export const og = await Worker("og", {
	name: ogWorkerName,
	adopt: true,
	delete: false,
	cwd: "../../apps/server",
	entrypoint: "src/og-worker.ts",
	compatibility: "node",
	bindings: {
		DB: db,
		OG_IMAGES: ogImages,
	},
	dev: {
		port: 3001,
	},
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);
console.log(`OG     -> ${og.url}`);

await app.finalize();
