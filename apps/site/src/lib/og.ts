import { PUBLIC_OG_URL } from "astro:env/client";

/** Bump to make social networks refetch the static cards. */
const STATIC_VERSION = "v5";

/** Pages the OG worker draws its own card for; everything else shares the site card. */
const STATIC_CARDS = new Set(["/site", "/journal", "/imprint", "/privacy"]);

const base = PUBLIC_OG_URL.replace(/\/$/, "");

export function staticOgUrl(path: string): string {
  return `${base}${STATIC_CARDS.has(path) ? path : "/site"}?v=${STATIC_VERSION}`;
}

/** A post's card, versioned by its last edit so a changed title gets a fresh image. */
export function journalOgUrl(slug: string, updatedAt: Date): string {
  return `${base}/journal/${slug}?v=${updatedAt.getTime().toString(36)}`;
}
