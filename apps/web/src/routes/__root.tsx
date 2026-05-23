import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ogBaseUrl, serverBaseUrl } from "@/lib/urls";
import type { trpc } from "@/utils/trpc";

import "../index.css";

export interface RouterAppContext {
	trpc: typeof trpc;
	queryClient: QueryClient;
}

const SITE_URL = "https://zias.be";
const SITE_TITLE = "Zias — Crafting Digital Experiences";
const SITE_DESCRIPTION =
	"A one-person studio building websites, web apps and mobile products for brands with taste.";
const SITE_TWITTER = "@ziasvannes";

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{ title: SITE_TITLE },
			{ name: "description", content: SITE_DESCRIPTION },
			{ name: "theme-color", content: "#2c86df" },
			{ name: "robots", content: "index, follow" },
			{ property: "og:type", content: "website" },
			{ property: "og:locale", content: "en_US" },
			{ property: "og:site_name", content: "Zias" },
			{ property: "og:title", content: SITE_TITLE },
			{ property: "og:description", content: SITE_DESCRIPTION },
			{ property: "og:url", content: SITE_URL },
			{
				property: "og:image",
				content: `${ogBaseUrl}/site`,
			},
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:alt", content: SITE_TITLE },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:site", content: SITE_TWITTER },
			{ name: "twitter:title", content: SITE_TITLE },
			{ name: "twitter:description", content: SITE_DESCRIPTION },
			{
				name: "twitter:image",
				content: `${ogBaseUrl}/site`,
			},
			{ name: "twitter:image:alt", content: SITE_TITLE },
		],
		links: [
			{ rel: "icon", href: "/favicon.ico", sizes: "48x48" },
			{
				rel: "icon",
				href: "/favicon-32x32.png",
				type: "image/png",
				sizes: "32x32",
			},
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
				sizes: "180x180",
			},
			{ rel: "manifest", href: "/site.webmanifest" },
			{
				rel: "alternate",
				type: "application/rss+xml",
				title: "Zias — Journal",
				href: `${serverBaseUrl}/rss.xml`,
			},
		],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "WebSite",
					name: "Zias",
					url: SITE_URL,
					description: SITE_DESCRIPTION,
					inLanguage: "en-US",
				}),
			},
			{
				src: "https://analytics.zias.be/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js",
				defer: true,
				"data-domain": "zias.be",
			},
			{
				children:
					"window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }",
			},
		],
	}),
});

function RootComponent() {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
		>
			<HeadContent />
			<Outlet />
			<Toaster richColors position="bottom-right" />
			<TanStackRouterDevtools position="bottom-left" />
			<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
		</ThemeProvider>
	);
}
