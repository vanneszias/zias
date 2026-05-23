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

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{ title: SITE_TITLE },
			{ name: "description", content: SITE_DESCRIPTION },
			{ name: "robots", content: "index, follow" },
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "Zias" },
			{ property: "og:title", content: SITE_TITLE },
			{ property: "og:description", content: SITE_DESCRIPTION },
			{ property: "og:url", content: SITE_URL },
			{
				property: "og:image",
				content: `${import.meta.env.VITE_SERVER_URL}/og/site`,
			},
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: SITE_TITLE },
			{ name: "twitter:description", content: SITE_DESCRIPTION },
			{
				name: "twitter:image",
				content: `${import.meta.env.VITE_SERVER_URL}/og/site`,
			},
		],
		links: [
			{ rel: "icon", href: "/favicon.ico", sizes: "48x48" },
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			{
				rel: "alternate",
				type: "application/rss+xml",
				title: "Zias — Journal",
				href: `${import.meta.env.VITE_SERVER_URL}/rss.xml`,
			},
		],
		scripts: [
			{
				src: "https://analytics.zias.be/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js",
				defer: true,
				"data-domain": "zias.be",
			},
			{
				children: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
			},
		],
	}),
});

function RootComponent() {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
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
