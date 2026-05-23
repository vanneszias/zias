import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { createElement, type ReactElement } from "react";
import satori from "satori";

let wasmReady = false;
let fontBuffer: ArrayBuffer | null = null;

const CARD_COLORS = {
	purple: "#6d5ac9",
	rose: "#ee5cbf",
	orange: "#ed4920",
	green: "#27c41f",
} as const;

const CATEGORY_ACCENT: Record<string, string> = {
	"words:essay": CARD_COLORS.purple,
	"words:note": CARD_COLORS.green,
	"work:case-study": CARD_COLORS.rose,
	"work:project": CARD_COLORS.rose,
	misc: CARD_COLORS.orange,
};

const JOURNAL_PREVIEW_CARDS = [
	{
		category: "WORDS - ESSAY",
		title: "Design systems for one-person studios.",
		meta: "Apr 2026 - 8 min read",
		color: CARD_COLORS.purple,
	},
	{
		category: "WORK - CASE STUDY",
		title: "kunstenkamp.be - a registration system that doesn't fight you.",
		meta: "Mar 2026 - 12 min read",
		color: CARD_COLORS.rose,
	},
	{
		category: "WORDS - ESSAY",
		title: "The shape of craft - what taste actually feels like.",
		meta: "Mar 2026 - 5 min read",
		color: CARD_COLORS.orange,
	},
	{
		category: "WORDS - NOTE",
		title: "Three things I changed about Suspense in production.",
		meta: "Feb 2026 - 3 min read",
		color: CARD_COLORS.green,
	},
] as const;

async function ensureWasm() {
	if (wasmReady) return;
	const res = await fetch(
		"https://cdn.jsdelivr.net/npm/@resvg/resvg-wasm@2.6.2/index_bg.wasm",
	);
	await initWasm(res);
	wasmReady = true;
}

async function getFont(): Promise<ArrayBuffer> {
	if (fontBuffer) return fontBuffer;
	const res = await fetch(
		"https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
	);
	if (!res.ok) throw new Error("Failed to fetch font");
	fontBuffer = await res.arrayBuffer();
	return fontBuffer;
}

async function renderPng(el: ReactElement): Promise<Uint8Array> {
	const font = await getFont();
	const svg = await satori(el, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: "Sora", data: font, weight: 400, style: "normal" },
			{ name: "Sora", data: font, weight: 600, style: "normal" },
			{ name: "Sora", data: font, weight: 700, style: "normal" },
			{ name: "Sora", data: font, weight: 800, style: "normal" },
		],
	});
	const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
	return resvg.render().asPng();
}

function cardOverlay() {
	return createElement("div", {
		style: {
			position: "absolute",
			inset: "40% 0 0 0",
			background:
				"linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.30) 100%)",
		},
	});
}

function arrowBadge() {
	return createElement(
		"div",
		{
			style: {
				width: 32,
				height: 32,
				borderRadius: 16,
				background: "rgba(255,255,255,0.18)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#ffffff",
				fontSize: 16,
				fontWeight: 700,
			},
		},
		"->",
	);
}

function postCard(input: {
	category: string;
	title: string;
	meta: string;
	background: string;
	width: number;
	height: number;
	titleSize: number;
}) {
	return createElement(
		"div",
		{
			style: {
				position: "relative",
				width: input.width,
				height: input.height,
				background: input.background,
				borderRadius: 12,
				overflow: "hidden",
				padding: 28,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			},
		},
		cardOverlay(),
		createElement(
			"div",
			{ style: { display: "flex", alignItems: "center" } },
			createElement(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						gap: 8,
						padding: "6px 12px",
						borderRadius: 999,
						background: "rgba(255,255,255,0.16)",
					},
				},
				createElement("div", {
					style: {
						width: 6,
						height: 6,
						borderRadius: 3,
						background: "#ffffff",
					},
				}),
				createElement(
					"div",
					{
						style: {
							fontSize: 11,
							fontWeight: 700,
							letterSpacing: "0.08em",
							color: "#ffffff",
							textTransform: "uppercase",
						},
					},
					input.category,
				),
			),
		),
		createElement(
			"div",
			{ style: { display: "flex", flexDirection: "column", gap: 22 } },
			createElement(
				"div",
				{
					style: {
						fontSize: input.titleSize,
						fontWeight: 700,
						lineHeight: 1.05,
						letterSpacing: "-0.015em",
						color: "#ffffff",
					},
				},
				input.title,
			),
			createElement(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "flex-end",
						justifyContent: "space-between",
					},
				},
				createElement(
					"div",
					{
						style: {
							fontSize: 14,
							fontWeight: 600,
							lineHeight: 1.4,
							opacity: 0.85,
							color: "#ffffff",
						},
					},
					input.meta,
				),
				arrowBadge(),
			),
		),
	);
}

export async function buildOgImage(post: {
	title: string;
	excerpt: string;
	category: string;
}): Promise<Uint8Array> {
	await ensureWasm();

	const accent = CATEGORY_ACCENT[post.category] ?? CARD_COLORS.purple;
	const categoryLabel = post.category.replace(":", " - ").toUpperCase();
	const excerpt =
		post.excerpt.length > 120
			? `${post.excerpt.slice(0, 120)}...`
			: post.excerpt;
	const title =
		post.title.length > 88 ? `${post.title.slice(0, 88)}...` : post.title;

	const el = createElement(
		"div",
		{
			style: {
				width: 1200,
				height: 630,
				display: "flex",
				position: "relative",
				overflow: "hidden",
				fontFamily: "Sora",
				background: "#2c86df",
			},
		},
		createElement("div", {
			style: {
				position: "absolute",
				inset: 0,
				background:
					"linear-gradient(145deg, #2c86df 0%, #2e70c6 48%, #2f5bb5 100%)",
			},
		}),
		createElement("div", {
			style: {
				position: "absolute",
				left: -200,
				top: -150,
				width: 700,
				height: 380,
				borderRadius: "50%",
				background:
					"radial-gradient(circle at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 75%)",
			},
		}),
		createElement("div", {
			style: {
				position: "absolute",
				right: -180,
				bottom: -160,
				width: 760,
				height: 420,
				borderRadius: "50%",
				background:
					"radial-gradient(circle at center, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 72%)",
			},
		}),
		createElement(
			"div",
			{
				style: {
					width: 1200,
					height: 630,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "38px 42px",
				},
			},
			createElement(
				"div",
				{
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					},
				},
				createElement(
					"div",
					{
						style: {
							fontSize: 16,
							fontWeight: 700,
							letterSpacing: "0.09em",
							color: "rgba(255,255,255,0.90)",
							textTransform: "uppercase",
						},
					},
					"The Journal",
				),
				createElement(
					"div",
					{ style: { fontSize: 24, fontWeight: 700, color: "#ffffff" } },
					"zias.be",
				),
			),
			postCard({
				category: categoryLabel,
				title,
				meta: excerpt || "Read the full article on zias.be",
				background: accent,
				width: 1116,
				height: 500,
				titleSize: title.length > 58 ? 50 : 56,
			}),
		),
	);

	return renderPng(el);
}

export async function buildJournalIndexOgImage(): Promise<Uint8Array> {
	await ensureWasm();
	const [card1, card2, card3, card4] = JOURNAL_PREVIEW_CARDS;

	const el = createElement(
		"div",
		{
			style: {
				width: 1200,
				height: 630,
				display: "flex",
				position: "relative",
				overflow: "hidden",
				background: "#2c86df",
				fontFamily: "Sora",
			},
		},
		createElement(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					width: 1200,
					height: 630,
				},
			},
			createElement(
				"div",
				{
					style: {
						display: "flex",
						justifyContent: "space-between",
					},
				},
				postCard({
					category: card1.category,
					title: card1.title,
					meta: card1.meta,
					background: card1.color,
					width: 589,
					height: 304,
					titleSize: 43,
				}),
				postCard({
					category: card2.category,
					title: card2.title,
					meta: card2.meta,
					background: card2.color,
					width: 589,
					height: 304,
					titleSize: 43,
				}),
			),
			createElement(
				"div",
				{
					style: {
						display: "flex",
						justifyContent: "space-between",
					},
				},
				postCard({
					category: card3.category,
					title: card3.title,
					meta: card3.meta,
					background: card3.color,
					width: 589,
					height: 304,
					titleSize: 43,
				}),
				postCard({
					category: card4.category,
					title: card4.title,
					meta: card4.meta,
					background: card4.color,
					width: 589,
					height: 304,
					titleSize: 43,
				}),
			),
		),
	);

	return renderPng(el);
}

export async function buildSiteOgImage(input: {
	title: string;
	subtitle: string;
	background?: string;
}): Promise<Uint8Array> {
	await ensureWasm();

	const title =
		input.title.length > 36 ? `${input.title.slice(0, 36)}...` : input.title;

	const el = createElement(
		"div",
		{
			style: {
				width: 1200,
				height: 630,
				display: "flex",
				position: "relative",
				overflow: "hidden",
				fontFamily: "Sora",
				background: input.background ?? "#2c2828",
			},
		},
		createElement("div", {
			style: {
				position: "absolute",
				inset: 0,
				background:
					"linear-gradient(132deg, #2c2828 0%, #2e2750 54%, #221e3b 100%)",
			},
		}),
		createElement("div", {
			style: {
				position: "absolute",
				left: -160,
				top: -160,
				width: 700,
				height: 460,
				borderRadius: "50%",
				background:
					"radial-gradient(circle at center, rgba(238,92,191,0.66) 0%, rgba(238,92,191,0) 72%)",
			},
		}),
		createElement("div", {
			style: {
				position: "absolute",
				right: -140,
				bottom: -180,
				width: 760,
				height: 460,
				borderRadius: "50%",
				background:
					"radial-gradient(circle at center, rgba(237,73,32,0.62) 0%, rgba(237,73,32,0) 72%)",
			},
		}),
		createElement(
			"div",
			{
				style: {
					width: 1200,
					height: 630,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "48px 54px 44px",
				},
			},
			createElement(
				"div",
				{
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					},
				},
				createElement(
					"div",
					{
						style: {
							fontSize: 15,
							fontWeight: 700,
							letterSpacing: "0.1em",
							textTransform: "uppercase",
							color: "rgba(255,255,255,0.88)",
						},
					},
					"Digital Studio",
				),
				createElement(
					"div",
					{ style: { fontSize: 24, fontWeight: 700, color: "#ffffff" } },
					"zias.be",
				),
			),
			createElement(
				"div",
				{ style: { display: "flex", flexDirection: "column", gap: 24 } },
				createElement(
					"div",
					{
						style: {
							fontSize: 98,
							fontWeight: 800,
							lineHeight: 0.93,
							letterSpacing: "-0.045em",
							color: "#ffffff",
							maxWidth: 760,
						},
					},
					title,
				),
				createElement(
					"div",
					{
						style: {
							fontSize: 28,
							fontWeight: 500,
							lineHeight: 1.35,
							color: "rgba(255,255,255,0.83)",
							maxWidth: 760,
						},
					},
					input.subtitle,
				),
			),
			createElement(
				"div",
				{ style: { display: "flex", gap: 16 } },
				...[
					{
						color: CARD_COLORS.purple,
						tag: "WORDS",
						title: "Essays and notes",
					},
					{ color: CARD_COLORS.rose, tag: "WORK", title: "Case studies" },
					{
						color: CARD_COLORS.orange,
						tag: "BUILD",
						title: "Products shipped",
					},
				].map((item) =>
					createElement(
						"div",
						{
							key: item.color,
							style: {
								background: item.color,
								borderRadius: 16,
								width: 250,
								height: 126,
								padding: "15px 16px",
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
							},
						},
						createElement(
							"div",
							{
								style: {
									fontSize: 11,
									fontWeight: 700,
									letterSpacing: "0.1em",
									textTransform: "uppercase",
									color: "rgba(255,255,255,0.92)",
								},
							},
							item.tag,
						),
						createElement(
							"div",
							{ style: { fontSize: 24, fontWeight: 700, color: "#ffffff" } },
							item.title,
						),
					),
				),
			),
		),
	);

	return renderPng(el);
}
