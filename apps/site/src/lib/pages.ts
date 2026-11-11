import { getEmDashEntry, getSeoMeta } from "emdash";
import { staticOgUrl } from "./og";

/** A page from the `pages` collection and its SEO fields, or null when it does not exist. */
export async function loadPage(slug: string, origin: string) {
  const { entry: page, cacheHint } = await getEmDashEntry("pages", slug);
  if (!page) return null;
  const path = slug === "home" ? "/" : `/${slug}`;
  const seo = getSeoMeta(page, {
    siteUrl: origin,
    path,
    defaultOgImage: staticOgUrl(slug === "home" ? "/site" : path),
  });
  return { page, seo, cacheHint };
}
