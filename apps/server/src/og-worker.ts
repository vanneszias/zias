import { createDb } from "@zias/db";
import { posts } from "@zias/db/schema/journal";
import { and, eq } from "drizzle-orm";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import {
	buildJournalIndexOgImage,
	buildOgImage,
	buildSiteOgImage,
	buildStaticPageOgImage,
} from "./og";

type OgBindings = {
	OG_IMAGES: R2Bucket;
};

type OgContext = Context<{ Bindings: OgBindings }>;

const app = new Hono<{ Bindings: OgBindings }>();

app.use(
	"/*",
	cors({
		origin: (origin) => {
			if (!origin) return null;
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
		allowMethods: ["GET", "OPTIONS"],
	}),
);

const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800";
const STATIC_VERSION = "v2";

function cacheHeaders() {
	return {
		"Content-Type": "image/png",
		"Cache-Control": CACHE_CONTROL,
	} as const;
}

function getVersion(input: string | undefined, fallback: string) {
	if (!input) return fallback;
	const cleaned = input.trim().toLowerCase();
	if (!/^[a-z0-9_-]{1,32}$/.test(cleaned)) return fallback;
	return cleaned;
}

function journalFallbackSvg(post: {
	title: string;
	excerpt: string;
	category: string;
}) {
	const escapedTitle = post.title
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
	const escapedExcerpt = post.excerpt
		.slice(0, 140)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
	const category = (post.category.split(":").pop() ?? post.category)
		.toUpperCase()
		.slice(0, 24);

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#6d5ac9"/>
  <circle cx="260" cy="70" r="260" fill="#ee5cbf" fill-opacity="0.32"/>
  <circle cx="960" cy="530" r="260" fill="#ed4920" fill-opacity="0.26"/>
  <rect x="68" y="126" rx="26" ry="26" width="1064" height="390" fill="#6d5ac9"/>
  <rect x="108" y="168" rx="18" ry="18" width="190" height="42" fill="rgba(255,255,255,0.22)"/>
  <text x="108" y="198" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="20" font-weight="700">${category}</text>
  <text x="108" y="300" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="66" font-weight="800">${escapedTitle}</text>
  <text x="108" y="372" fill="rgba(255,255,255,0.82)" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="30">${escapedExcerpt}</text>
  <text x="72" y="562" fill="rgba(255,255,255,0.85)" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="30" font-weight="700">zias.be</text>
</svg>`;
}

function staticFallbackSvg(input: {
	title: string;
	subtitle: string;
	background: string;
	accent: string;
}) {
	const escapedTitle = input.title
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
	const escapedSubtitle = input.subtitle
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${input.background}"/>
  <circle cx="220" cy="80" r="290" fill="${input.accent}" fill-opacity="0.55"/>
  <circle cx="1030" cy="520" r="280" fill="#ed4920" fill-opacity="0.34"/>
  <text x="72" y="270" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="90" font-weight="800">${escapedTitle}</text>
  <text x="76" y="342" fill="rgba(255,255,255,0.78)" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="30">${escapedSubtitle}</text>
  <text x="72" y="562" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="30" font-weight="800">zias.be</text>
</svg>`;
}

async function readImage(bucket: R2Bucket, key: string) {
	const obj = await bucket.get(key);
	if (!obj) return null;
	return new Response(obj.body, {
		headers: cacheHeaders(),
	});
}

async function writeImage(bucket: R2Bucket, key: string, png: Uint8Array) {
	await bucket.put(key, png, {
		httpMetadata: {
			contentType: "image/png",
			cacheControl: CACHE_CONTROL,
		},
	});
}

async function serveStaticImage(
	c: OgContext,
	input: {
		keyPrefix: string;
		fallback: {
			title: string;
			subtitle: string;
			background: string;
			accent: string;
		};
		build: () => Promise<Uint8Array>;
	},
) {
	const version = getVersion(c.req.query("v"), STATIC_VERSION);
	const key = `${input.keyPrefix}/${version}.png`;
	const cacheKey = c.req.raw;
	const cache = caches.default;

	const cached = await cache.match(cacheKey);
	if (cached) return cached;

	const fromR2 = await readImage(c.env.OG_IMAGES, key);
	if (fromR2) {
		c.executionCtx.waitUntil(cache.put(cacheKey, fromR2.clone()));
		return fromR2;
	}

	try {
		const png = await input.build();
		await writeImage(c.env.OG_IMAGES, key, png);

		const res = new Response(png, { headers: cacheHeaders() });
		c.executionCtx.waitUntil(cache.put(cacheKey, res.clone()));
		return res;
	} catch {
		return new Response(staticFallbackSvg(input.fallback), {
			headers: {
				"Content-Type": "image/svg+xml; charset=utf-8",
				"Cache-Control": "public, max-age=3600, s-maxage=86400",
			},
		});
	}
}

app.get("/site", async (c) => {
	return serveStaticImage(c, {
		keyPrefix: "site",
		fallback: {
			title: "Zias",
			subtitle: "Crafting digital experiences.",
			background: "#6d5ac9",
			accent: "#ee5cbf",
		},
		build: () =>
			buildSiteOgImage({
				title: "Crafting Digital experiences.",
				subtitle:
					"A one-person studio building websites, web apps and mobile products for brands with taste.",
			}),
	});
});

app.get("/journal", async (c) => {
	return serveStaticImage(c, {
		keyPrefix: "journal/index",
		fallback: {
			title: "The Journal.",
			subtitle: "Writing, case studies, and notes from the work.",
			background: "#2c86df",
			accent: "#ee5cbf",
		},
		build: () => buildJournalIndexOgImage(),
	});
});

app.get("/privacy", async (c) => {
	return serveStaticImage(c, {
		keyPrefix: "privacy",
		fallback: {
			title: "Privacy Policy",
			subtitle: "Clear data handling for zias.be.",
			background: "#2c2828",
			accent: "#2c86df",
		},
		build: () =>
			buildStaticPageOgImage({
				kind: "privacy",
				title: "Privacy Policy",
				subtitle: "Clear, boring-in-the-best-way data handling for zias.be.",
				kicker: "Privacy / Data",
			}),
	});
});

app.get("/imprint", async (c) => {
	return serveStaticImage(c, {
		keyPrefix: "imprint",
		fallback: {
			title: "Imprint",
			subtitle: "Legal disclosure for zias.be.",
			background: "#ed4920",
			accent: "#fff8ed",
		},
		build: () =>
			buildStaticPageOgImage({
				kind: "imprint",
				title: "Imprint",
				subtitle: "Legal disclosure, contact details, and site ownership.",
				kicker: "Legal / Contact",
			}),
	});
});

app.get("/journal/:slug", async (c) => {
	const slug = c.req.param("slug");
	const db = createDb();
	const post = await db.query.posts.findFirst({
		where: and(eq(posts.slug, slug), eq(posts.isDraft, false)),
		columns: {
			title: true,
			excerpt: true,
			category: true,
			readTime: true,
			publishedAt: true,
			updatedAt: true,
		},
	});

	if (!post) return c.notFound();

	const version = post.updatedAt ? post.updatedAt.getTime().toString(36) : "v0";
	const key = `journal/${slug}/${version}.png`;
	const cacheKey = c.req.raw;
	const cache = caches.default;

	const cached = await cache.match(cacheKey);
	if (cached) return cached;

	const fromR2 = await readImage(c.env.OG_IMAGES, key);
	if (fromR2) {
		c.executionCtx.waitUntil(cache.put(cacheKey, fromR2.clone()));
		return fromR2;
	}

	try {
		const png = await buildOgImage(post);
		await writeImage(c.env.OG_IMAGES, key, png);

		const res = new Response(png, { headers: cacheHeaders() });
		c.executionCtx.waitUntil(cache.put(cacheKey, res.clone()));
		return res;
	} catch {
		return new Response(journalFallbackSvg(post), {
			headers: {
				"Content-Type": "image/svg+xml; charset=utf-8",
				"Cache-Control": "public, max-age=3600, s-maxage=86400",
			},
		});
	}
});

export default app;
