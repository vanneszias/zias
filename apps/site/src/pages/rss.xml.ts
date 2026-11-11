import { getPosts } from "@zias/blocks/journal";
import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";

const xml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c] ?? c,
  );

export const GET: APIRoute = async ({ url }) => {
  const [settings, { entries }] = await Promise.all([
    getSiteSettings(),
    getPosts({ limit: 50 }),
  ]);
  const items = entries
    .filter((post) => post.data.publishedAt)
    .map((post) => {
      const link = `${url.origin}/journal/${post.id}`;
      return `    <item>
      <title>${xml(post.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${post.data.publishedAt?.toUTCString()}</pubDate>
      <description>${xml(post.data.excerpt ?? "")}</description>
    </item>`;
    });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(settings.title || "Zias")}</title>
    <link>${url.origin}/journal</link>
    <description>${xml(settings.tagline ?? "")}</description>
    <atom:link href="${url.origin}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>
${items.join("\n")}
  </channel>
</rss>
`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
