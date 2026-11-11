import { type StaticImageName, postImage, staticImages } from "./images";
import { findPublishedPost } from "./posts";

type Env = { OG_IMAGES: R2Bucket; DB: D1Database };

const STATIC_VERSION = "v4";
const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800";
const pngHeaders = { "Content-Type": "image/png", "Cache-Control": CACHE_CONTROL };

const STATIC_ROUTES: Record<string, StaticImageName> = {
  "/site": "site",
  "/journal": "journal",
  "/privacy": "privacy",
  "/imprint": "imprint",
};

function cleanVersion(input: string | null, fallback: string) {
  const v = input?.trim().toLowerCase();
  return v && /^[a-z0-9_-]{1,32}$/.test(v) ? v : fallback;
}

/** Serve from edge cache, then R2; otherwise render, store in R2 and cache. */
async function cached(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  key: string,
  render: () => Promise<Uint8Array>,
): Promise<Response> {
  const edge = caches.default;
  const hit = await edge.match(request);
  if (hit) return hit;

  const stored = await env.OG_IMAGES.get(key);
  const res = stored
    ? new Response(stored.body, { headers: pngHeaders })
    : await (async () => {
        const png = await render();
        ctx.waitUntil(
          env.OG_IMAGES.put(key, png, {
            httpMetadata: { contentType: "image/png", cacheControl: CACHE_CONTROL },
          }),
        );
        return new Response(png, { headers: pngHeaders });
      })();
  ctx.waitUntil(edge.put(request, res.clone()));
  return res;
}

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const version = cleanVersion(url.searchParams.get("v"), STATIC_VERSION);

    const name = STATIC_ROUTES[path];
    if (name) {
      return cached(request, env, ctx, `${name}/${version}.png`, staticImages[name]);
    }

    const match = /^\/journal\/([a-z0-9][a-z0-9_-]{0,127})$/.exec(path);
    if (match?.[1]) {
      const slug = match[1];
      const post = await findPublishedPost(env.DB, slug);
      if (!post) {
        // Unknown or unpublished: show the generic site image, never leak drafts.
        return cached(request, env, ctx, `site/${STATIC_VERSION}.png`, staticImages.site);
      }
      const stamp = post.updatedAt ? Date.parse(post.updatedAt).toString(36) : "v0";
      return cached(request, env, ctx, `journal/${slug}/${stamp}.png`, () => postImage(post));
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
