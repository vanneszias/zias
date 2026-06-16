import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@zias/ui/components/card";
import { AdminPill, AdminShell } from "@/components/admin-shell";
import { authClient } from "@/lib/auth-client";
import { journalOgUrl, staticOgUrl } from "@/lib/og";
import { trpc } from "@/utils/trpc";

const STATIC_PAGES: { label: string; path: string; ogPath: string }[] = [
	{ label: "Home", path: "/", ogPath: "/site" },
	{ label: "Journal", path: "/journal", ogPath: "/journal" },
	{ label: "Privacy", path: "/privacy", ogPath: "/privacy" },
	{ label: "Imprint", path: "/imprint", ogPath: "/imprint" },
];

export const Route = createFileRoute("/admin/seo")({
	component: AdminSeoPreview,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) throw redirect({ to: "/admin/login" });
	},
});

function OgCard({
	label,
	path,
	ogUrl,
	type,
}: {
	label: string;
	path: string;
	ogUrl: string;
	type: "page" | "post";
}) {
	return (
		<Card size="sm">
			<CardContent className="pt-0">
				<div className="overflow-hidden border bg-muted">
					<div style={{ aspectRatio: "1200 / 630" }}>
						<img
							src={ogUrl}
							alt={`OG preview for ${label}`}
							className="h-full w-full object-cover"
							loading="lazy"
						/>
					</div>
				</div>
				<div className="mt-3 flex items-start justify-between gap-3">
					<div className="min-w-0">
						<p className="truncate font-medium text-sm">{label}</p>
						<p className="truncate text-muted-foreground text-xs">{path}</p>
					</div>
					<AdminPill>{type}</AdminPill>
				</div>
			</CardContent>
		</Card>
	);
}

function AdminSeoPreview() {
	const { data: posts } = useQuery(trpc.journal.adminList.queryOptions());
	const published = (posts ?? []).filter((p) => !p.isDraft);

	return (
		<AdminShell
			title="SEO previews"
			description="Open Graph images for public pages and published posts."
			backTo="/admin"
			backLabel="Dashboard"
		>
			<div className="flex flex-col gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Static pages</CardTitle>
						<CardDescription>
							Reusable site-level OG image previews.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{STATIC_PAGES.map((page) => (
							<OgCard
								key={page.path}
								label={page.label}
								path={page.path}
								ogUrl={staticOgUrl(page.ogPath)}
								type="page"
							/>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Journal posts</CardTitle>
						<CardDescription>
							{published.length} published posts with generated previews.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{published.length > 0 ? (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
								{published.map((post) => (
									<OgCard
										key={post.id}
										label={post.title}
										path={`/journal/${post.slug}`}
										ogUrl={journalOgUrl(post.slug, post.updatedAt)}
										type="post"
									/>
								))}
							</div>
						) : posts !== undefined ? (
							<div className="border border-dashed p-10 text-center">
								<p className="font-medium text-sm">No published posts.</p>
								<p className="mt-1 text-muted-foreground text-sm">
									Post previews appear after publishing.
								</p>
							</div>
						) : null}
					</CardContent>
				</Card>
			</div>
		</AdminShell>
	);
}
