/** Minimal RSS 2.0 builder — no runtime dependencies. */

export interface FeedPost {
	slug: string;
	title: string;
	excerpt: string;
	category: string;
	publishedAt: Date;
}

export interface FeedOptions {
	/** Canonical base URL of the site, no trailing slash. E.g. "https://zias.be" */
	baseUrl: string;
	title?: string;
	description?: string;
	language?: string;
}

function escapeXml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/**
 * Generates a well-formed RSS 2.0 feed from a list of published posts.
 * Returns the full XML string ready to be served with `Content-Type: application/rss+xml`.
 */
export function buildRssFeed(posts: FeedPost[], opts: FeedOptions): string {
	const {
		baseUrl,
		title = "zias.be",
		description = "Writing, case studies, and notes from the work.",
		language = "en",
	} = opts;

	const feedUrl = `${baseUrl}/rss.xml`;
	const now = new Date().toUTCString();

	const items = posts
		.map((post) => {
			const url = `${baseUrl}/journal/${post.slug}`;
			const pubDate = post.publishedAt.toUTCString();
			return `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>
			<pubDate>${pubDate}</pubDate>
			<category>${escapeXml(post.category)}</category>
			<description>${escapeXml(post.excerpt)}</description>
		</item>`.trimStart();
		})
		.join("\n\t\t");

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(title)}</title>
		<link>${baseUrl}</link>
		<description>${escapeXml(description)}</description>
		<language>${language}</language>
		<lastBuildDate>${now}</lastBuildDate>
		<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
		${items}
	</channel>
</rss>`;
}
