import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@zias/api/context";
import { appRouter } from "@zias/api/routers/index";
import { createAuth } from "@zias/auth";
import { createDb } from "@zias/db";
import { posts } from "@zias/db/schema/journal";
import { env } from "@zias/env/server";
import { buildRssFeed, fetchPublishedPosts } from "@zias/feed";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { initLogger } from "evlog";
import {
	type BetterAuthInstance,
	createAuthMiddleware,
} from "evlog/better-auth";
import { type EvlogVariables, evlog } from "evlog/hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { buildOgImage, buildSiteOgImage } from "./og";

initLogger({
	env: { service: "zias-server" },
});

const app = new Hono<EvlogVariables>();

function resolveSiteOrigin(reqUrl: string, configuredOrigin: string) {
	if (configuredOrigin && !configuredOrigin.includes("localhost")) {
		return configuredOrigin.replace(/\/$/, "");
	}

	const origin = new URL(reqUrl).origin;
	if (origin.includes("://api.")) {
		return origin.replace("://api.", "://");
	}

	return origin;
}

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
		origin: (origin) => {
			if (!origin) return null;
			const allowed = env.CORS_ORIGIN.split(",").map((item) => item.trim());
			return allowed.includes(origin) ? origin : null;
		},
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
	const feedPosts = await fetchPublishedPosts();
	const baseUrl = resolveSiteOrigin(c.req.url, env.CORS_ORIGIN);
	const xml = buildRssFeed(feedPosts, { baseUrl });
	return c.body(xml, 200, {
		"Content-Type": "application/rss+xml; charset=utf-8",
		"Cache-Control": "public, max-age=3600, s-maxage=3600",
	});
});

app.get("/og/journal/:slug", async (c) => {
	const slug = c.req.param("slug");
	const db = createDb();
	const post = await db.query.posts.findFirst({
		where: and(eq(posts.slug, slug), eq(posts.isDraft, false)),
		columns: { title: true, excerpt: true, category: true },
	});

	if (!post) return c.notFound();

	const png = await buildOgImage(post);
	// Cast is safe: @resvg/resvg-wasm always returns a regular ArrayBuffer
	return c.body(png as unknown as Uint8Array<ArrayBuffer>, 200, {
		"Content-Type": "image/png",
		"Cache-Control": "public, max-age=86400, s-maxage=604800",
	});
});

app.get("/og/site", async (c) => {
	try {
		const png = await buildSiteOgImage({
			title: "Zias",
			subtitle: "Crafting digital experiences.",
			background: "#2c2828",
		});

		return c.body(png as unknown as Uint8Array<ArrayBuffer>, 200, {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=86400, s-maxage=604800",
		});
	} catch {
		const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#2c2828"/>
  <text x="72" y="250" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="84" font-weight="800">Zias</text>
  <text x="72" y="320" fill="rgba(255,255,255,0.8)" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="38">Crafting digital experiences.</text>
  <text x="72" y="560" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="34" font-weight="700">zias.be</text>
</svg>`;

		return c.body(svg, 200, {
			"Content-Type": "image/svg+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		});
	}
});

app.get("/sitemap.xml", async (c) => {
	const base = resolveSiteOrigin(c.req.url, env.CORS_ORIGIN);
	const db = createDb();

	const publishedPosts = await db.query.posts.findMany({
		where: and(eq(posts.isDraft, false), isNotNull(posts.publishedAt)),
		orderBy: [desc(posts.publishedAt)],
		columns: { slug: true, publishedAt: true, updatedAt: true },
	});

	const staticUrls = [
		{ loc: `${base}/`, priority: "1.0", changefreq: "weekly" },
		{ loc: `${base}/journal`, priority: "0.8", changefreq: "weekly" },
		{ loc: `${base}/privacy`, priority: "0.3", changefreq: "yearly" },
		{ loc: `${base}/imprint`, priority: "0.3", changefreq: "yearly" },
	];

	const postUrls = publishedPosts.map((p) => {
		const lastmod = (p.updatedAt ?? p.publishedAt)?.toISOString().split("T")[0];
		return {
			loc: `${base}/journal/${p.slug}`,
			lastmod,
			priority: "0.7",
			changefreq: "monthly",
		};
	});

	const toEntry = (u: {
		loc: string;
		lastmod?: string;
		priority: string;
		changefreq: string;
	}) =>
		[
			"  <url>",
			`    <loc>${u.loc}</loc>`,
			u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
			`    <changefreq>${u.changefreq}</changefreq>`,
			`    <priority>${u.priority}</priority>`,
			"  </url>",
		]
			.filter(Boolean)
			.join("\n");

	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[...staticUrls, ...postUrls].map(toEntry),
		"</urlset>",
	].join("\n");

	return c.body(xml, 200, {
		"Content-Type": "application/xml; charset=utf-8",
		"Cache-Control": "public, max-age=3600, s-maxage=86400",
	});
});

app.get("/robots.txt", (c) => {
	const base = resolveSiteOrigin(c.req.url, env.CORS_ORIGIN);
	const txt = [
		"User-agent: *",
		"Allow: /",
		"Disallow: /admin",
		"Disallow: /api/auth",
		`Sitemap: ${base}/sitemap.xml`,
	].join("\n");

	return c.body(txt, 200, {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "public, max-age=3600, s-maxage=86400",
	});
});

export default app;
