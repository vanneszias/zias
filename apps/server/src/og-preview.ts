import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
	buildJournalIndexOgImage,
	buildOgImage,
	buildSiteOgImage,
	buildStaticPageOgImage,
} from "./og";

async function main() {
	const outDir = join(process.cwd(), ".og-previews");
	await mkdir(outDir, { recursive: true });

	const [sitePng, journalIndexPng, journalPostPng, privacyPng, imprintPng] =
		await Promise.all([
			buildSiteOgImage({
				title: "Crafting Digital experiences.",
				subtitle:
					"A one-person studio building websites, web apps and mobile products for brands with taste.",
			}),
			buildJournalIndexOgImage(),
			buildOgImage({
				title: "Design systems for one-person studios.",
				excerpt:
					"A practical guide to shaping a tiny but resilient design system for real product velocity.",
				category: "words:essay",
				readTime: 8,
				publishedAt: new Date("2026-04-08T00:00:00.000Z"),
			}),
			buildStaticPageOgImage({
				kind: "privacy",
				title: "Privacy Policy",
				subtitle: "Clear, boring-in-the-best-way data handling for zias.be.",
				kicker: "Privacy / Data",
			}),
			buildStaticPageOgImage({
				kind: "imprint",
				title: "Imprint",
				subtitle: "Legal disclosure, contact details, and site ownership.",
				kicker: "Legal / Contact",
			}),
		]);

	await Promise.all([
		writeFile(join(outDir, "site.png"), sitePng),
		writeFile(join(outDir, "journal-index.png"), journalIndexPng),
		writeFile(join(outDir, "journal-post.png"), journalPostPng),
		writeFile(join(outDir, "privacy.png"), privacyPng),
		writeFile(join(outDir, "imprint.png"), imprintPng),
	]);

	console.log(`OG previews generated in ${outDir}`);
}

main().catch((error) => {
	console.error("Failed to generate OG previews", error);
	process.exit(1);
});
