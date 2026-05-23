import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

const SERVER_URL = (import.meta.env.VITE_SERVER_URL as string).replace(/\/$/, "");

const STATIC_PAGES: { label: string; path: string }[] = [
	{ label: "Home", path: "/" },
	{ label: "Journal", path: "/journal" },
	{ label: "Privacy", path: "/privacy" },
	{ label: "Imprint", path: "/imprint" },
];

export const Route = createFileRoute("/admin/seo")({
	component: AdminSeoPreview,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) throw redirect({ to: "/admin/login" });
	},
});

function OgCard({ label, path, ogUrl }: { label: string; path: string; ogUrl: string }) {
	return (
		<div className="flex flex-col gap-2">
			<div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
				<div style={{ aspectRatio: "1200 / 630" }}>
					<img
						src={ogUrl}
						alt={`OG preview for ${label}`}
						className="h-full w-full object-cover"
						loading="lazy"
					/>
				</div>
			</div>
			<div>
				<p className="font-semibold text-section-hero-fg text-sm">{label}</p>
				<p className="text-section-hero-subtext text-xs">{path}</p>
			</div>
		</div>
	);
}

function AdminSeoPreview() {
	const { data: posts } = useQuery(trpc.journal.adminList.queryOptions());
	const published = (posts ?? []).filter((p) => !p.isDraft);

	return (
		<AdminShell
			title="OG image previews"
			description="Visual preview of Open Graph images for all public pages."
		>
			<div className="flex flex-col gap-10">
				<div>
					<h2 className="mb-4 font-semibold text-section-hero-fg/60 text-xs uppercase tracking-widest">
						Static pages
					</h2>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{STATIC_PAGES.map((page) => (
							<OgCard
								key={page.path}
								label={page.label}
								path={page.path}
								ogUrl={`${SERVER_URL}/og/site`}
							/>
						))}
					</div>
				</div>

				{published.length > 0 ? (
					<div>
						<h2 className="mb-4 font-semibold text-section-hero-fg/60 text-xs uppercase tracking-widest">
							Journal posts
						</h2>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{published.map((post) => (
								<OgCard
									key={post.id}
									label={post.title}
									path={`/journal/${post.slug}`}
									ogUrl={`${SERVER_URL}/og/journal/${post.slug}`}
								/>
							))}
						</div>
					</div>
				) : null}

				{published.length === 0 && posts !== undefined ? (
					<p className="text-section-hero-subtext text-sm">
						No published posts yet — OG images will appear here once you publish.
					</p>
				) : null}
			</div>
		</AdminShell>
	);
}
