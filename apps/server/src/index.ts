import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@zias/api/context";
import { appRouter } from "@zias/api/routers/index";
import { getAuth } from "@zias/auth";
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

initLogger({
  env: { service: "zias-server" },
});

const app = new Hono<EvlogVariables>();
const auth = getAuth();
const identifyUser = createAuthMiddleware(auth as BetterAuthInstance, {
  exclude: [
    "/api/auth/**",
    "/og/**",
    "/rss.xml",
    "/sitemap.xml",
    "/robots.txt",
  ],
  maskEmail: true,
});

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
  await identifyUser(c.get("log"), c.req.raw.headers, c.req.path);
  await next();
});

app.use(
  "/*",
  cors({
    origin: (origin) => {
      if (!origin) return null;
      const allowed = env.CORS_ORIGIN.split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      if (allowed.includes(origin)) return origin;

      const { hostname, protocol } = new URL(origin);
      if (
        protocol === "https:" &&
        (hostname === "zias.be" || hostname.endsWith(".zias.be"))
      ) {
        return origin;
      }

      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return origin;
      }

      return null;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

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
