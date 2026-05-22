import { createDb } from "@zias/db";
import { posts } from "@zias/db/schema/journal";
import { and, desc, isNotNull, eq } from "drizzle-orm";
import type { FeedPost } from "./rss";

/**
 * Fetches all published, non-draft posts from D1 in descending publish order.
 * Call this inside a Cloudflare Worker where the DB binding is available.
 */
export async function fetchPublishedPosts(): Promise<FeedPost[]> {
	const db = createDb();

	const rows = await db.query.posts.findMany({
		where: and(eq(posts.isDraft, false), isNotNull(posts.publishedAt)),
		orderBy: [desc(posts.publishedAt)],
		columns: {
			slug: true,
			title: true,
			excerpt: true,
			category: true,
			publishedAt: true,
		},
	});

	return rows
		.filter((r): r is typeof r & { publishedAt: Date } => r.publishedAt !== null)
		.map((r) => ({
			slug: r.slug,
			title: r.title,
			excerpt: r.excerpt,
			category: r.category,
			publishedAt: r.publishedAt,
		}));
}
