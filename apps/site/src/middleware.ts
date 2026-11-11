import { defineMiddleware } from "astro:middleware";
import { getEmDashEntry } from "emdash";

/**
 * While "Under construction" is switched on (Site > Site status in the
 * admin), visitors get that page at every URL. The admin stays reachable and
 * anyone signed in to it sees the real site. A database without the status
 * entry counts as under construction, so a fresh deploy never shows a
 * half-filled site.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith("/_") || context.locals.user)
    return next();
  const { entry } = await getEmDashEntry("site", "status").catch(() => ({
    entry: null,
  }));
  if (entry && !entry.data.under_construction) return next();
  context.locals.underConstruction = {
    message: entry?.data.message?.trim() || "The new site is on its way.",
  };
  return next("/under-construction");
});
