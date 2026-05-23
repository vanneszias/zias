import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { type ReactElement, createElement } from "react";
import satori from "satori";

let wasmReady = false;
let fontBuffer: ArrayBuffer | null = null;

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
		"https://cdn.jsdelivr.net/npm/@fontsource-variable/sora@5.2.8/files/sora-latin-wght-normal.woff2",
	);
	if (!res.ok) throw new Error("Failed to fetch font");
	fontBuffer = await res.arrayBuffer();
	return fontBuffer;
}

const CATEGORY_ACCENT: Record<string, string> = {
	"words:essay": "#7c6fd4",
	"words:note": "#7c6fd4",
	"work:case-study": "#f06fd0",
	"work:project": "#f06fd0",
	misc: "#34c924",
};

async function renderPng(el: ReactElement): Promise<Uint8Array> {
	const font = await getFont();
	const svg = await satori(el, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: "Sora", data: font, weight: 400, style: "normal" },
			{ name: "Sora", data: font, weight: 700, style: "normal" },
			{ name: "Sora", data: font, weight: 800, style: "normal" },
		],
	});
	const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
	return resvg.render().asPng();
}

export async function buildOgImage(post: {
	title: string;
	excerpt: string;
	category: string;
}): Promise<Uint8Array> {
	await ensureWasm();

	const accent = CATEGORY_ACCENT[post.category] ?? "#7c6fd4";
	const excerpt =
		post.excerpt.length > 130
			? `${post.excerpt.slice(0, 130)}…`
			: post.excerpt;
	const titleSize =
		post.title.length > 65 ? 46 : post.title.length > 45 ? 54 : 64;
	const categoryLabel = post.category.split(":").pop() ?? post.category;

	const el = createElement(
		"div",
		{
			style: {
				display: "flex",
				width: "1200px",
				height: "630px",
				background: "#090909",
				position: "relative",
				overflow: "hidden",
				fontFamily: "Sora",
			},
		},
		// Large accent glow — top-right
		createElement("div", {
			style: {
				position: "absolute",
				right: -160,
				top: -160,
				width: 580,
				height: 580,
				borderRadius: "50%",
				background: accent,
				opacity: 0.18,
			},
		}),
		// Smaller echo glow — bottom-left
		createElement("div", {
			style: {
				position: "absolute",
				left: -60,
				bottom: -60,
				width: 240,
				height: 240,
				borderRadius: "50%",
				background: accent,
				opacity: 0.09,
			},
		}),
		// Content
		createElement(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "60px 72px",
					width: "1200px",
					height: "630px",
				},
			},
			// Category pill
			createElement(
				"div",
				{ style: { display: "flex" } },
				createElement(
					"div",
					{
						style: {
							display: "flex",
							alignItems: "center",
							background: accent,
							color: "#fff",
							fontSize: 13,
							fontWeight: 700,
							padding: "7px 20px",
							borderRadius: "100px",
							letterSpacing: "0.08em",
							textTransform: "uppercase",
						},
					},
					categoryLabel,
				),
			),
			// Title + excerpt
			createElement(
				"div",
				{ style: { display: "flex", flexDirection: "column", gap: 18 } },
				createElement(
					"div",
					{
						style: {
							fontSize: titleSize,
							fontWeight: 800,
							color: "#ffffff",
							lineHeight: 1.05,
							letterSpacing: "-0.025em",
							maxWidth: "900px",
						},
					},
					post.title,
				),
				excerpt
					? createElement(
							"div",
							{
								style: {
									fontSize: 21,
									color: "rgba(255,255,255,0.45)",
									lineHeight: 1.55,
									maxWidth: "800px",
								},
							},
							excerpt,
						)
					: null,
			),
			// Footer
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
							display: "flex",
							alignItems: "center",
							gap: 10,
						},
					},
					createElement("div", {
						style: {
							width: 7,
							height: 7,
							borderRadius: "50%",
							background: accent,
						},
					}),
					createElement(
						"div",
						{
							style: {
								fontSize: 15,
								fontWeight: 600,
								color: "rgba(255,255,255,0.35)",
								letterSpacing: "0.05em",
								textTransform: "uppercase",
							},
						},
						"Journal",
					),
				),
				createElement(
					"div",
					{
						style: {
							fontSize: 26,
							fontWeight: 700,
							color: "rgba(255,255,255,0.85)",
							letterSpacing: "-0.015em",
						},
					},
					"zias.be",
				),
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

	const el = createElement(
		"div",
		{
			style: {
				display: "flex",
				width: "1200px",
				height: "630px",
				background: "#090909",
				position: "relative",
				overflow: "hidden",
				fontFamily: "Sora",
			},
		},
		// Large purple glow — top-right
		createElement("div", {
			style: {
				position: "absolute",
				right: -200,
				top: -200,
				width: 700,
				height: 700,
				borderRadius: "50%",
				background: "#7c6fd4",
				opacity: 0.16,
			},
		}),
		// Pink echo — bottom-left
		createElement("div", {
			style: {
				position: "absolute",
				left: -80,
				bottom: -80,
				width: 340,
				height: 340,
				borderRadius: "50%",
				background: "#f06fd0",
				opacity: 0.1,
			},
		}),
		// Content
		createElement(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "72px",
					width: "1200px",
					height: "630px",
				},
			},
			// Top label
			createElement(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						gap: 12,
					},
				},
				createElement("div", {
					style: {
						width: 9,
						height: 9,
						borderRadius: "50%",
						background: "#7c6fd4",
					},
				}),
				createElement(
					"div",
					{
						style: {
							fontSize: 16,
							fontWeight: 700,
							color: "rgba(255,255,255,0.4)",
							letterSpacing: "0.1em",
							textTransform: "uppercase",
						},
					},
					"Digital Studio",
				),
			),
			// Title + subtitle
			createElement(
				"div",
				{ style: { display: "flex", flexDirection: "column", gap: 24 } },
				createElement(
					"div",
					{
						style: {
							fontSize: 92,
							fontWeight: 800,
							color: "#ffffff",
							lineHeight: 0.95,
							letterSpacing: "-0.04em",
						},
					},
					input.title,
				),
				createElement(
					"div",
					{
						style: {
							fontSize: 26,
							color: "rgba(255,255,255,0.5)",
							lineHeight: 1.45,
							maxWidth: "680px",
							letterSpacing: "-0.005em",
						},
					},
					input.subtitle,
				),
			),
			// Footer
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
							fontWeight: 600,
							color: "rgba(255,255,255,0.3)",
							letterSpacing: "0.08em",
							textTransform: "uppercase",
						},
					},
					"Brussels",
				),
				createElement(
					"div",
					{
						style: {
							fontSize: 28,
							fontWeight: 700,
							color: "rgba(255,255,255,0.85)",
							letterSpacing: "-0.02em",
						},
					},
					"zias.be",
				),
			),
		),
	);

	return renderPng(el);
}
