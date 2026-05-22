import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@zias/api/context";
import { appRouter } from "@zias/api/routers/index";
import { createAuth } from "@zias/auth";
import { env } from "@zias/env/server";
import { buildRssFeed, fetchPublishedPosts } from "@zias/feed";
import { initLogger } from "evlog";
import {
	type BetterAuthInstance,
	createAuthMiddleware,
} from "evlog/better-auth";
import { type EvlogVariables, evlog } from "evlog/hono";
import { Hono } from "hono";
import { cors } from "hono/cors";

initLogger({
	env: { service: "zias-server" },
});

const app = new Hono<EvlogVariables>();

app.use(evlog());
app.use("*", async (c, next) => {
	const identifyUser = createAuthMiddleware(
		createAuth() as BetterAuthInstance,
		{
			exclude: ["/api/auth/**"],
			maskEmail: true,
		},
	);
	await identifyUser(c.get("log"), c.req.raw.headers, c.req.path);
	await next();
});

app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => createAuth().handler(c.req.raw));

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) => {
			return createContext({ context });
		},
	}),
);

app.get("/", (c) => {
	return c.text("OK");
});

app.get("/rss.xml", async (c) => {
	const posts = await fetchPublishedPosts();
	const xml = buildRssFeed(posts, { baseUrl: env.CORS_ORIGIN });
	return c.body(xml, 200, {
		"Content-Type": "application/rss+xml; charset=utf-8",
		"Cache-Control": "public, max-age=3600, s-maxage=3600",
	});
});

export default app;
