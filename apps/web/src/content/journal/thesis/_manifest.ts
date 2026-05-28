import type { SeriesManifest } from "@/lib/multi-page-manifest";

export const manifest: SeriesManifest = {
	seriesTitle: "AI Licensing, Legal Compliance & Ethics",
	subtitle: "Bachelor's Thesis",
	description:
		"Measuring Copyright Risks and Ethical Implications in Open-Weight vs. Proprietary Language Models",
	pages: [
		{
			slug: "index",
			title: "Abstract",
			shortTitle: "Abstract",
		},
		{
			slug: "intro",
			title: "Introduction",
			shortTitle: "Introduction",
		},
		{
			slug: "copyright",
			title: "Copyright Risk & Training Data Detection",
			shortTitle: "Copyright Risk",
		},
		{
			slug: "safety",
			title: "Safety & Ethical Evaluation",
			shortTitle: "Safety",
		},
		{
			slug: "transparency",
			title: "Transparency, Regulation & Compliance",
			shortTitle: "Transparency",
		},
		{
			slug: "framework",
			title: "Comparative Risk & Ethics Framework",
			shortTitle: "Framework",
		},
		{
			slug: "recommendations",
			title: "Practical Recommendations",
			shortTitle: "Recommendations",
		},
		{
			slug: "manifest",
			title: "AI Manifest",
			shortTitle: "Manifest",
		},
		{
			slug: "model-fit",
			title: "Model Fit Test",
			shortTitle: "Model Fit",
		},
		{
			slug: "bibliography",
			title: "Bibliography",
			shortTitle: "Bibliography",
		},
	],
};
