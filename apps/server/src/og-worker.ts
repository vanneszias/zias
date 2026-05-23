import { createDb } from "@zias/db";
import { posts } from "@zias/db/schema/journal";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { buildJournalIndexOgImage, buildOgImage, buildSiteOgImage } from "./og";

type OgBindings = {
	OG_IMAGES: R2Bucket;
};

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

function siteFallbackSvg() {
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#6d5ac9"/>
  <circle cx="250" cy="60" r="290" fill="#ee5cbf" fill-opacity="0.36"/>
  <circle cx="1030" cy="520" r="280" fill="#ed4920" fill-opacity="0.32"/>
  <text x="72" y="260" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="92" font-weight="800">Zias</text>
  <text x="72" y="320" fill="rgba(255,255,255,0.82)" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="30">Crafting digital experiences.</text>
  <text x="72" y="562" fill="rgba(255,255,255,0.85)" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="30" font-weight="700">zias.be</text>
</svg>`;
}

function journalIndexFallbackSvg() {
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#2c86df"/>
  <rect x="0" y="0" width="589" height="304" rx="12" fill="#6d5ac9"/>
  <rect x="611" y="0" width="589" height="304" rx="12" fill="#ee5cbf"/>
  <rect x="0" y="326" width="589" height="304" rx="12" fill="#ed4920"/>
  <rect x="611" y="326" width="589" height="304" rx="12" fill="#27c41f"/>
</svg>`;
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

app.get("/site", async (c) => {
	const version = getVersion(c.req.query("v"), "v1");
	const key = `site/${version}.png`;
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
		const png = await buildSiteOgImage({
			title: "Zias",
			subtitle: "Crafting digital experiences.",
			background: "#2c2828",
		});

		await writeImage(c.env.OG_IMAGES, key, png);

		const res = new Response(png, { headers: cacheHeaders() });
		c.executionCtx.waitUntil(cache.put(cacheKey, res.clone()));
		return res;
	} catch {
		return new Response(siteFallbackSvg(), {
			headers: {
				"Content-Type": "image/svg+xml; charset=utf-8",
				"Cache-Control": "public, max-age=3600, s-maxage=86400",
			},
		});
	}
});

app.get("/journal", async (c) => {
	const version = getVersion(c.req.query("v"), "v1");
	const key = `journal/index/${version}.png`;
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
		const png = await buildJournalIndexOgImage();
		await writeImage(c.env.OG_IMAGES, key, png);

		const res = new Response(png, { headers: cacheHeaders() });
		c.executionCtx.waitUntil(cache.put(cacheKey, res.clone()));
		return res;
	} catch {
		return new Response(journalIndexFallbackSvg(), {
			headers: {
				"Content-Type": "image/svg+xml; charset=utf-8",
				"Cache-Control": "public, max-age=3600, s-maxage=86400",
			},
		});
	}
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
