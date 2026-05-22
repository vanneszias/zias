/** Estimate reading time in minutes. Assumes ~200 wpm. */
export function calcReadingTime(text: string): number {
	const words = text.trim().split(/\s+/).length;
	return Math.max(1, Math.round(words / 200));
}

/** Slugify a title into a URL-safe string. */
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** Format a date as "Mon YYYY" (e.g. "Apr 2026"). Accepts Date or ISO string. */
export function formatPostDate(date: Date | string): string {
	return new Date(date).toLocaleDateString("en-GB", {
		month: "short",
		year: "numeric",
	});
}
