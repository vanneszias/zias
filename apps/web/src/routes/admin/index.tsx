import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
	AdminActionLink,
	AdminPill,
	AdminShell,
} from "@/components/admin-shell";
import { authClient } from "@/lib/auth-client";
import { ogBaseUrl, serverBaseUrl } from "@/lib/urls";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) {
			throw redirect({ to: "/admin/login" });
		}
		return { session: session.data };
	},
});

function AdminDashboard() {
	const {
		data: posts,
		isLoading: postsLoading,
		isError: postsError,
	} = useQuery(trpc.journal.adminList.queryOptions());
	const {
		data: contacts,
		isLoading: contactsLoading,
		isError: contactsError,
	} = useQuery(trpc.contact.list.queryOptions());

	const unread = contacts?.filter((c) => !c.isRead).length ?? 0;
	const drafts = posts?.filter((p) => p.isDraft).length ?? 0;
	const published = posts?.filter((p) => !p.isDraft).length ?? 0;
	const loading = postsLoading || contactsLoading;
	const hasError = postsError || contactsError;
	const recentDrafts = (posts ?? [])
		.filter((p) => p.isDraft)
		.slice(0, 5)
		.map((p) => ({ id: p.id, title: p.title, slug: p.slug }));
	const latestMessages = (contacts ?? []).slice(0, 5);

	return (
		<AdminShell
			title="Admin control center"
			description="Overview, publishing health, and quick actions for day-to-day operations."
			actions={
				<>
					<AdminActionLink to="/admin/posts/new" strong>
						New post
					</AdminActionLink>
					<button
						type="button"
						onClick={() => authClient.signOut()}
						className="rounded-full border border-white/25 bg-white/10 px-4 py-2 font-semibold text-section-hero-fg text-sm transition-colors hover:bg-white/20 focus-visible:outline-none"
					>
						Sign out
					</button>
				</>
			}
		>
			{hasError ? (
				<div className="mb-6 rounded-2xl border border-red-300/35 bg-red-300/10 p-4 text-red-100">
					<p className="font-semibold">Could not load dashboard stats.</p>
					<p className="mt-1 text-red-100/80 text-sm">
						Please refresh the page and try again.
					</p>
				</div>
			) : null}

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<StatCard label="Published" value={published} to="/admin/posts" />
				<StatCard label="Drafts" value={drafts} to="/admin/posts" />
				<StatCard
					label="Unread messages"
					value={unread}
					highlight={unread > 0}
					to="/admin/messages"
				/>
			</div>

			{loading ? (
				<p className="mt-3 text-section-hero-subtext text-sm">
					Updating latest numbers...
				</p>
			) : null}

			<div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
				<div className="space-y-4">
					<Panel
						title="Action queue"
						subtitle="What needs attention right now."
					>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
								<div className="flex items-center justify-between">
									<p className="font-semibold text-section-hero-fg text-sm">
										Inbox
									</p>
									<AdminPill variant={unread > 0 ? "warn" : "success"}>
										{unread > 0 ? `${unread} unread` : "caught up"}
									</AdminPill>
								</div>
								<p className="mt-2 text-section-hero-subtext text-sm">
									{unread > 0
										? "New leads waiting for follow-up."
										: "No pending messages right now."}
								</p>
								<AdminActionLink to="/admin/messages">
									Open inbox
								</AdminActionLink>
							</div>
							<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
								<div className="flex items-center justify-between">
									<p className="font-semibold text-section-hero-fg text-sm">
										Draft backlog
									</p>
									<AdminPill variant={drafts > 0 ? "warn" : "success"}>
										{drafts > 0 ? `${drafts} drafts` : "clear"}
									</AdminPill>
								</div>
								<p className="mt-2 text-section-hero-subtext text-sm">
									{drafts > 0
										? "Publish or archive pending work."
										: "No unfinished drafts."}
								</p>
								<AdminActionLink to="/admin/posts">
									Review drafts
								</AdminActionLink>
							</div>
						</div>
					</Panel>

					<Panel title="Quick drafts" subtitle="Jump back into recent drafts.">
						<div className="space-y-2">
							{recentDrafts.length === 0 ? (
								<p className="text-section-hero-subtext text-sm">
									No drafts in progress.
								</p>
							) : (
								recentDrafts.map((draft) => (
									<Link
										key={draft.id}
										to="/admin/posts/$id/edit"
										params={{ id: draft.id }}
										className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition-colors hover:bg-white/10"
									>
										<span className="truncate text-section-hero-fg">
											{draft.title}
										</span>
										<span className="truncate text-section-hero-subtext text-xs">
											/{draft.slug}
										</span>
									</Link>
								))
							)}
						</div>
					</Panel>
				</div>

				<div className="space-y-4">
					<SeoPublishPreview />
					<Panel title="Recent messages" subtitle="Latest contact activity.">
						<div className="space-y-2">
							{latestMessages.length === 0 ? (
								<p className="text-section-hero-subtext text-sm">
									No messages yet.
								</p>
							) : (
								latestMessages.map((msg) => (
									<div
										key={msg.id}
										className="rounded-xl border border-white/10 bg-white/5 p-3"
									>
										<div className="flex items-center justify-between gap-2">
											<p className="truncate font-semibold text-section-hero-fg text-sm">
												{msg.name || "Anonymous"}
											</p>
											<AdminPill variant={msg.isRead ? "default" : "warn"}>
												{msg.isRead ? "read" : "new"}
											</AdminPill>
										</div>
										<p className="mt-1 line-clamp-2 text-section-hero-subtext text-xs">
											{msg.message}
										</p>
									</div>
								))
							)}
						</div>
						<div className="mt-4">
							<AdminActionLink to="/admin/messages">
								View all messages
							</AdminActionLink>
						</div>
					</Panel>
				</div>
			</div>
		</AdminShell>
	);
}

type EndpointStatus = {
	url: string;
	label: string;
	status: "checking" | "ok" | "error";
	httpStatus?: number;
	preview?: string;
};

function SeoPublishPreview() {
	const [rows, setRows] = useState<EndpointStatus[]>([]);

	const endpoints = useMemo(
		() => [
			{ label: "Robots", url: "/robots.txt" },
			{ label: "Sitemap", url: "/sitemap.xml" },
			{ label: "RSS", url: "/rss.xml" },
			{ label: "OG Site", url: `${ogBaseUrl}/site` },
			{ label: "Server Sitemap", url: `${serverBaseUrl}/sitemap.xml` },
			{ label: "Server Robots", url: `${serverBaseUrl}/robots.txt` },
		],
		[],
	);

	useEffect(() => {
		let cancelled = false;
		setRows(
			endpoints.map((e) => ({
				label: e.label,
				url: e.url,
				status: "checking",
			})),
		);

		void Promise.all(
			endpoints.map(async (endpoint) => {
				try {
					const res = await fetch(endpoint.url, { method: "GET" });
					const contentType = res.headers.get("content-type") ?? "";
					let preview = "";
					if (contentType.includes("text") || contentType.includes("xml")) {
						const txt = await res.text();
						preview = txt.slice(0, 120).replace(/\s+/g, " ").trim();
					}

					if (cancelled) return;
					setRows((prev) =>
						prev.map((row) =>
							row.url === endpoint.url
								? {
										...row,
										status: res.ok ? "ok" : "error",
										httpStatus: res.status,
										preview,
									}
								: row,
						),
					);
				} catch {
					if (cancelled) return;
					setRows((prev) =>
						prev.map((row) =>
							row.url === endpoint.url ? { ...row, status: "error" } : row,
						),
					);
				}
			}),
		);

		return () => {
			cancelled = true;
		};
	}, [endpoints]);

	return (
		<div className="rounded-2xl border border-white/10 bg-white/5 p-5">
			<h2 className="font-bold font-display text-section-hero-fg text-xl">
				SEO + OG publish status
			</h2>
			<p className="mt-1 text-section-hero-subtext text-sm">
				Quick check for robots, sitemap, RSS, and OG endpoints.
			</p>

			<div className="mt-4 space-y-2">
				{rows.map((row) => (
					<div
						key={row.url}
						className="rounded-xl border border-white/10 bg-black/15 p-3"
					>
						<div className="flex flex-wrap items-center justify-between gap-2">
							<p className="font-semibold text-section-hero-fg text-sm">
								{row.label}
							</p>
							<p
								className={
									row.status === "ok"
										? "text-emerald-300 text-xs"
										: row.status === "error"
											? "text-red-300 text-xs"
											: "text-section-hero-subtext text-xs"
								}
							>
								{row.status === "checking"
									? "Checking..."
									: row.status === "ok"
										? `OK ${row.httpStatus ?? ""}`
										: `Error ${row.httpStatus ?? ""}`}
							</p>
						</div>
						<p className="mt-1 truncate text-section-hero-subtext text-xs">
							{row.url}
						</p>
						{row.preview ? (
							<p className="mt-1 text-section-hero-fg/80 text-xs">
								{row.preview}
							</p>
						) : null}
					</div>
				))}
			</div>
			<div className="mt-4">
				<AdminActionLink to="/admin/seo">View OG previews</AdminActionLink>
			</div>
		</div>
	);
}

function StatCard({
	label,
	value,
	highlight,
	to,
}: {
	label: string;
	value: number;
	highlight?: boolean;
	to: string;
}) {
	return (
		<Link
			to={to as "/"}
			className={`rounded-2xl border p-5 transition-colors hover:bg-white/15 ${
				highlight ? "border-white/35 bg-white/12" : "border-white/10 bg-white/5"
			}`}
		>
			<p className="text-label text-section-hero-subtext text-xs uppercase tracking-[0.16em]">
				{label}
			</p>
			<p className="mt-2 font-display font-extrabold text-4xl text-section-hero-fg">
				{value}
			</p>
		</Link>
	);
}

function Panel({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle: string;
	children: React.ReactNode;
}) {
	return (
		<section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
			<h2 className="font-bold font-display text-section-hero-fg text-xl">
				{title}
			</h2>
			<p className="mt-1 text-section-hero-subtext text-sm">{subtitle}</p>
			<div className="mt-4">{children}</div>
		</section>
	);
}
