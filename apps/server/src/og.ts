import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { createElement, type ReactElement } from "react";
import satori from "satori";

const WIDTH = 1200;
const HEIGHT = 630;

let wasmReady = false;
let displayFontBuffer: ArrayBuffer | null = null;
let bodyFontBuffer: ArrayBuffer | null = null;
let renderQueue: Promise<void> = Promise.resolve();

const COLORS = {
	charcoal: "#2c2828",
	purple: "#6d5ac9",
	rose: "#ee5cbf",
	blue: "#2c86df",
	orange: "#ed4920",
	green: "#27c41f",
	cream: "#fff8ed",
	white: "#ffffff",
} as const;

const CATEGORY_ACCENT: Record<string, string> = {
	"words:essay": COLORS.purple,
	"words:note": COLORS.green,
	"work:case-study": COLORS.rose,
	"work:project": COLORS.rose,
	misc: COLORS.orange,
};

const CATEGORY_LABEL: Record<string, string> = {
	"words:essay": "Words / Essay",
	"words:note": "Words / Note",
	"work:case-study": "Work / Case Study",
	"work:project": "Work / Project",
	misc: "Misc",
};

const JOURNAL_PREVIEW_CARDS = [
	{
		category: "Words",
		title: "Notes on taste, systems and useful edges.",
		accent: COLORS.purple,
		x: 708,
		y: 90,
	},
	{
		category: "Work",
		title: "Case studies from shipped products.",
		accent: COLORS.rose,
		x: 820,
		y: 258,
	},
	{
		category: "Build",
		title: "Tiny decisions, durable software.",
		accent: COLORS.orange,
		x: 655,
		y: 410,
	},
] as const;

type StaticPageKind = "site" | "journal" | "privacy" | "imprint";

async function ensureWasm() {
	if (wasmReady) return;
	const res = await fetch(
		"https://cdn.jsdelivr.net/npm/@resvg/resvg-wasm@2.6.2/index_bg.wasm",
	);
	await initWasm(res);
	wasmReady = true;
}

async function getDisplayFont(): Promise<ArrayBuffer> {
	if (displayFontBuffer) return displayFontBuffer;
	const res = await fetch(
		"https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/BeVietnamPro-ExtraBold.ttf",
	);
	if (!res.ok) throw new Error("Failed to fetch display font");
	displayFontBuffer = await res.arrayBuffer();
	return displayFontBuffer;
}

async function getBodyFont(): Promise<ArrayBuffer> {
	if (bodyFontBuffer) return bodyFontBuffer;
	const res = await fetch(
		"https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/BeVietnamPro-Regular.ttf",
	);
	if (!res.ok) throw new Error("Failed to fetch body font");
	bodyFontBuffer = await res.arrayBuffer();
	return bodyFontBuffer;
}

async function renderPngNow(el: ReactElement): Promise<Uint8Array> {
	const [displayFont, bodyFont] = await Promise.all([
		getDisplayFont(),
		getBodyFont(),
	]);
	const svg = await satori(el, {
		width: WIDTH,
		height: HEIGHT,
		fonts: [
			{ name: "Sora", data: displayFont, weight: 400, style: "normal" },
			{ name: "Sora", data: displayFont, weight: 600, style: "normal" },
			{ name: "Sora", data: displayFont, weight: 700, style: "normal" },
			{ name: "Sora", data: displayFont, weight: 800, style: "normal" },
			{
				name: "Be Vietnam Pro",
				data: bodyFont,
				weight: 400,
				style: "normal",
			},
		],
	});
	const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } });
	return resvg.render().asPng();
}

async function renderPng(el: ReactElement): Promise<Uint8Array> {
	const task = renderQueue.then(() => renderPngNow(el));
	renderQueue = task.then(
		() => undefined,
		() => undefined,
	);
	return task;
}

function truncate(input: string, max: number) {
	const value = input.trim();
	if (value.length <= max) return value;
	return `${value.slice(0, max - 1).trimEnd()}…`;
}

function rootStyle(background: string) {
	return {
		width: WIDTH,
		height: HEIGHT,
		display: "flex",
		position: "relative",
		overflow: "hidden",
		fontFamily: "Sora",
		background,
		color: COLORS.white,
	} as const;
}

function blob(input: {
	left?: number;
	top?: number;
	right?: number;
	bottom?: number;
	width: number;
	height: number;
	color: string;
	opacity: number;
}) {
	const position = {
		...(input.left !== undefined ? { left: input.left } : {}),
		...(input.top !== undefined ? { top: input.top } : {}),
		...(input.right !== undefined ? { right: input.right } : {}),
		...(input.bottom !== undefined ? { bottom: input.bottom } : {}),
	};

	return createElement("div", {
		style: {
			position: "absolute",
			...position,
			width: input.width,
			height: input.height,
			borderRadius: "999px",
			background: `radial-gradient(ellipse at center, ${input.color} 0%, rgba(255,255,255,0) 70%)`,
			opacity: input.opacity,
		},
	});
}

function grain() {
	return createElement("div", {
		style: {
			position: "absolute",
			inset: 0,
			opacity: 0.16,
			backgroundImage:
				"linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
			backgroundSize: "42px 42px",
		},
	});
}

function siteMark(color: string = COLORS.white) {
	return createElement(
		"div",
		{
			style: {
				display: "flex",
				alignItems: "center",
				gap: 14,
				color,
			},
		},
		createElement("div", {
			style: {
				width: 34,
				height: 34,
				borderRadius: 17,
				background: color,
			},
		}),
		createElement(
			"div",
			{
				style: {
					fontSize: 27,
					fontWeight: 800,
					letterSpacing: "-0.04em",
				},
			},
			"zias.be",
		),
	);
}

function label(text: string, accent: string = COLORS.white) {
	return createElement(
		"div",
		{
			style: {
				display: "flex",
				alignItems: "center",
				gap: 10,
				fontSize: 16,
				fontWeight: 800,
				letterSpacing: "0.12em",
				textTransform: "uppercase",
				color: "rgba(255,255,255,0.86)",
			},
		},
		createElement("div", {
			style: {
				width: 10,
				height: 10,
				borderRadius: 5,
				background: accent,
			},
		}),
		text,
	);
}

function diagonalBand(color: string, top: number, left: number) {
	return createElement("div", {
		style: {
			position: "absolute",
			top,
			left,
			width: 920,
			height: 86,
			background: color,
			transform: "rotate(-9deg)",
			borderRadius: 999,
			opacity: 0.92,
		},
	});
}

function miniCard(input: {
	category: string;
	title: string;
	accent: string;
	x: number;
	y: number;
}) {
	return createElement(
		"div",
		{
			style: {
				position: "absolute",
				left: input.x,
				top: input.y,
				width: 330,
				height: 148,
				padding: "22px 24px",
				borderRadius: 28,
				background: input.accent,
				transform: "rotate(0deg)",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			},
		},
		createElement(
			"div",
			{
				style: {
					fontSize: 12,
					fontWeight: 800,
					letterSpacing: "0.12em",
					textTransform: "uppercase",
					opacity: 0.82,
				},
			},
			input.category,
		),
		createElement(
			"div",
			{
				style: {
					fontSize: 28,
					fontWeight: 800,
					lineHeight: 1.04,
					letterSpacing: "-0.04em",
				},
			},
			input.title,
		),
	);
}

function staticBackground(kind: StaticPageKind) {
	if (kind === "privacy") {
		return [
			COLORS.charcoal,
			`linear-gradient(128deg, ${COLORS.charcoal} 0%, #3d345f 50%, #172f4b 100%)`,
			COLORS.blue,
			COLORS.green,
		] as const;
	}
	if (kind === "imprint") {
		return [
			COLORS.orange,
			`linear-gradient(132deg, ${COLORS.orange} 0%, #b42e2c 48%, ${COLORS.charcoal} 100%)`,
			COLORS.cream,
			COLORS.rose,
		] as const;
	}
	if (kind === "journal") {
		return [
			COLORS.blue,
			`linear-gradient(135deg, ${COLORS.blue} 0%, #315fbb 54%, ${COLORS.purple} 100%)`,
			COLORS.rose,
			COLORS.orange,
		] as const;
	}
	return [
		COLORS.purple,
		`linear-gradient(130deg, ${COLORS.purple} 0%, #563caa 42%, ${COLORS.charcoal} 100%)`,
		COLORS.rose,
		COLORS.orange,
	] as const;
}

export async function buildStaticPageOgImage(input: {
	kind: StaticPageKind;
	title: string;
	subtitle: string;
	kicker: string;
}): Promise<Uint8Array> {
	await ensureWasm();
	const [, gradient, glowA, glowB] = staticBackground(input.kind);
	const isJournal = input.kind === "journal";
	const isLegal = input.kind === "privacy" || input.kind === "imprint";

	const el = createElement(
		"div",
		{ style: rootStyle(gradient) },
		grain(),
		blob({
			left: -220,
			top: -180,
			width: 720,
			height: 500,
			color: glowA,
			opacity: 0.78,
		}),
		blob({
			right: -210,
			bottom: -190,
			width: 800,
			height: 520,
			color: glowB,
			opacity: 0.72,
		}),
		diagonalBand("rgba(255,255,255,0.12)", 72, 462),
		diagonalBand("rgba(44,40,40,0.18)", 504, -170),
		isJournal
			? createElement(
					"div",
					{ style: { position: "absolute", inset: 0, display: "flex" } },
					miniCard(JOURNAL_PREVIEW_CARDS[0]),
					miniCard(JOURNAL_PREVIEW_CARDS[1]),
					miniCard(JOURNAL_PREVIEW_CARDS[2]),
				)
			: createElement(
					"div",
					{
						style: {
							position: "absolute",
							right: 80,
							top: 112,
							width: 308,
							height: 386,
							borderRadius: 38,
							background: isLegal
								? "rgba(255,255,255,0.14)"
								: "rgba(255,255,255,0.12)",
							border: "2px solid rgba(255,255,255,0.22)",
							transform: isLegal ? "rotate(4deg)" : "rotate(-6deg)",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							padding: 30,
						},
					},
					createElement("div", {
						style: {
							width: 88,
							height: 88,
							borderRadius: 44,
							background: isLegal ? glowA : COLORS.orange,
						},
					}),
					createElement(
						"div",
						{
							style: {
								fontSize: 62,
								fontWeight: 800,
								lineHeight: 0.9,
								letterSpacing: "-0.07em",
							},
						},
						isLegal ? "No\nsmall\nprint." : "Build\nwith\ntaste.",
					),
				),
		createElement(
			"div",
			{
				style: {
					position: "relative",
					width: WIDTH,
					height: HEIGHT,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "50px 62px 48px",
				},
			},
			createElement(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					},
				},
				label(input.kicker, glowB),
				siteMark(),
			),
			createElement(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						gap: 26,
						maxWidth: isJournal ? 650 : 760,
					},
				},
				createElement(
					"div",
					{
						style: {
							fontSize: input.title.length > 28 ? 82 : 104,
							fontWeight: 800,
							lineHeight: 0.92,
							letterSpacing: "-0.07em",
						},
					},
					input.title,
				),
				createElement(
					"div",
					{
						style: {
							fontFamily: "Be Vietnam Pro",
							fontSize: 29,
							lineHeight: 1.34,
							color: "rgba(255,255,255,0.78)",
							maxWidth: 710,
						},
					},
					input.subtitle,
				),
			),
			createElement(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						gap: 14,
						fontFamily: "Be Vietnam Pro",
						fontSize: 19,
						color: "rgba(255,255,255,0.72)",
					},
				},
				"One-person studio",
				createElement("div", {
					style: {
						width: 5,
						height: 5,
						borderRadius: 3,
						background: "rgba(255,255,255,0.5)",
					},
				}),
				"Leuven, Belgium",
			),
		),
	);

	return renderPng(el);
}

export async function buildSiteOgImage(input: {
	title: string;
	subtitle: string;
}): Promise<Uint8Array> {
	return buildStaticPageOgImage({
		kind: "site",
		title: input.title,
		subtitle: input.subtitle,
		kicker: "Digital Studio",
	});
}

export async function buildJournalIndexOgImage(): Promise<Uint8Array> {
	return buildStaticPageOgImage({
		kind: "journal",
		title: "The Journal.",
		subtitle: "Writing, case studies, and notes from the work.",
		kicker: "Essays / Notes / Work",
	});
}

function articleMeta(input: { readTime?: number; publishedAt?: Date | null }) {
	const parts = [];
	if (input.publishedAt) {
		parts.push(
			new Intl.DateTimeFormat("en", {
				month: "short",
				year: "numeric",
			}).format(input.publishedAt),
		);
	}
	if (input.readTime) parts.push(`${input.readTime} min read`);
	return parts.length ? parts.join(" / ") : "Read the full article";
}

export async function buildOgImage(post: {
	title: string;
	excerpt: string;
	category: string;
	readTime?: number;
	publishedAt?: Date | null;
}): Promise<Uint8Array> {
	await ensureWasm();

	const accent = CATEGORY_ACCENT[post.category] ?? COLORS.purple;
	const labelText =
		CATEGORY_LABEL[post.category] ?? post.category.replace(":", " / ");
	const title = truncate(post.title, 86);
	const excerpt = truncate(post.excerpt || "An article by Zias.", 150);
	const longTitle = title.length > 58;

	const el = createElement(
		"div",
		{
			style: rootStyle(
				`linear-gradient(132deg, ${COLORS.charcoal} 0%, #30245d 46%, ${accent} 100%)`,
			),
		},
		grain(),
		blob({
			left: -190,
			top: -160,
			width: 720,
			height: 500,
			color: accent,
			opacity: 0.76,
		}),
		blob({
			right: -220,
			bottom: -190,
			width: 800,
			height: 520,
			color: COLORS.orange,
			opacity: 0.52,
		}),
		diagonalBand("rgba(255,255,255,0.11)", 90, 520),
		createElement("div", {
			style: {
				position: "absolute",
				right: 72,
				top: 92,
				width: 355,
				height: 428,
				borderRadius: 42,
				background: accent,
				transform: "rotate(6deg)",
			},
		}),
		createElement("div", {
			style: {
				position: "absolute",
				right: 116,
				top: 138,
				width: 255,
				height: 326,
				borderRadius: 34,
				border: "3px solid rgba(255,255,255,0.38)",
				transform: "rotate(6deg)",
			},
		}),
		createElement(
			"div",
			{
				style: {
					position: "relative",
					width: WIDTH,
					height: HEIGHT,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "50px 62px 48px",
				},
			},
			createElement(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					},
				},
				label("The Journal", accent),
				siteMark(),
			),
			createElement(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						gap: 26,
						maxWidth: 790,
					},
				},
				createElement(
					"div",
					{
						style: {
							display: "flex",
							alignItems: "center",
							gap: 14,
							padding: "12px 18px",
							borderRadius: 999,
							background: "rgba(255,255,255,0.16)",
							border: "1px solid rgba(255,255,255,0.18)",
						},
					},
					createElement("div", {
						style: {
							width: 12,
							height: 12,
							borderRadius: 6,
							background: accent,
						},
					}),
					createElement(
						"div",
						{
							style: {
								fontSize: 17,
								fontWeight: 800,
								letterSpacing: "0.08em",
								textTransform: "uppercase",
							},
						},
						labelText,
					),
				),
				createElement(
					"div",
					{
						style: {
							fontSize: longTitle ? 66 : 82,
							fontWeight: 800,
							lineHeight: 0.94,
							letterSpacing: "-0.065em",
						},
					},
					title,
				),
				createElement(
					"div",
					{
						style: {
							fontFamily: "Be Vietnam Pro",
							fontSize: 27,
							lineHeight: 1.34,
							color: "rgba(255,255,255,0.76)",
							maxWidth: 720,
						},
					},
					excerpt,
				),
			),
			createElement(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						fontFamily: "Be Vietnam Pro",
						fontSize: 20,
						color: "rgba(255,255,255,0.72)",
					},
				},
				articleMeta({ readTime: post.readTime, publishedAt: post.publishedAt }),
				createElement(
					"div",
					{
						style: {
							display: "flex",
							alignItems: "center",
							gap: 12,
							fontFamily: "Sora",
							fontWeight: 800,
							color: COLORS.white,
						},
					},
					"Read on zias.be",
					createElement(
						"div",
						{
							style: {
								width: 38,
								height: 38,
								borderRadius: 19,
								background: "rgba(255,255,255,0.2)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							},
						},
						"->",
					),
				),
			),
		),
	);

	return renderPng(el);
}
