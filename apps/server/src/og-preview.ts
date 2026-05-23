import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildJournalIndexOgImage, buildOgImage, buildSiteOgImage } from "./og";

async function main() {
	const outDir = join(process.cwd(), ".og-previews");
	await mkdir(outDir, { recursive: true });

	const [sitePng, journalIndexPng, journalPostPng] = await Promise.all([
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
		}),
	]);

	await Promise.all([
		writeFile(join(outDir, "site.png"), sitePng),
		writeFile(join(outDir, "journal-index.png"), journalIndexPng),
		writeFile(join(outDir, "journal-post.png"), journalPostPng),
	]);

	console.log(`OG previews generated in ${outDir}`);
}

main().catch((error) => {
	console.error("Failed to generate OG previews", error);
	process.exit(1);
});
