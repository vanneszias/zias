import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@zias/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@zias/ui/components/card";
import { Skeleton } from "@zias/ui/components/skeleton";
import { cn } from "@zias/ui/lib/utils";
import {
	AlertCircleIcon,
	ArrowRightIcon,
	FileTextIcon,
	InboxIcon,
	RadioTowerIcon,
} from "lucide-react";
import type { ReactNode } from "react";
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
			title="Dashboard"
			description="Current publishing status, inbox load, and service checks."
			actions={
				<>
					<AdminActionLink to="/admin/posts/new" strong>
						New post
					</AdminActionLink>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => authClient.signOut()}
					>
						Sign out
					</Button>
				</>
			}
		>
			{hasError ? (
				<Card className="mb-4 border-destructive/30 bg-destructive/5">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-destructive">
							<AlertCircleIcon className="size-4" />
							Dashboard data failed to load
						</CardTitle>
						<CardDescription>
							Refresh the page before making publishing decisions.
						</CardDescription>
					</CardHeader>
				</Card>
			) : null}

			<div className="grid gap-3 md:grid-cols-3">
				<MetricCard
					label="Published"
					value={published}
					description="Public posts"
					to="/admin/posts"
					icon={<FileTextIcon className="size-4" />}
					loading={loading}
				/>
				<MetricCard
					label="Drafts"
					value={drafts}
					description="Unpublished work"
					to="/admin/posts"
					icon={<FileTextIcon className="size-4" />}
					loading={loading}
				/>
				<MetricCard
					label="Unread"
					value={unread}
					description="Messages awaiting review"
					to="/admin/messages"
					icon={<InboxIcon className="size-4" />}
					loading={loading}
					attention={unread > 0}
				/>
			</div>

			<div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
				<div className="flex flex-col gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Needs attention</CardTitle>
							<CardDescription>
								Small queues that affect daily operations.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-3 sm:grid-cols-2">
							<QueueItem
								title="Inbox"
								status={unread > 0 ? `${unread} unread` : "clear"}
								active={unread > 0}
								description={
									unread > 0
										? "Reply to new contact requests."
										: "No new messages."
								}
								to="/admin/messages"
							/>
							<QueueItem
								title="Draft backlog"
								status={drafts > 0 ? `${drafts} drafts` : "clear"}
								active={drafts > 0}
								description={
									drafts > 0
										? "Finish, schedule, or archive drafts."
										: "No drafts waiting."
								}
								to="/admin/posts"
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Drafts</CardTitle>
							<CardDescription>
								Continue recent unpublished posts.
							</CardDescription>
							<CardAction>
								<AdminActionLink to="/admin/posts">All posts</AdminActionLink>
							</CardAction>
						</CardHeader>
						<CardContent>
							{loading ? (
								<div className="flex flex-col gap-2">
									<Skeleton className="h-9" />
									<Skeleton className="h-9" />
									<Skeleton className="h-9" />
								</div>
							) : recentDrafts.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									No drafts in progress.
								</p>
							) : (
								<div className="divide-y border">
									{recentDrafts.map((draft) => (
										<Link
											key={draft.id}
											to="/admin/posts/$id/edit"
											params={{ id: draft.id }}
											className="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-muted"
										>
											<span className="min-w-0 truncate font-medium">
												{draft.title}
											</span>
											<span className="shrink-0 text-muted-foreground text-xs">
												/{draft.slug}
											</span>
										</Link>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col gap-4">
					<SeoPublishPreview />
					<Card>
						<CardHeader>
							<CardTitle>Recent messages</CardTitle>
							<CardDescription>Latest contact form activity.</CardDescription>
							<CardAction>
								<AdminActionLink to="/admin/messages">
									Open inbox
								</AdminActionLink>
							</CardAction>
						</CardHeader>
						<CardContent>
							{loading ? (
								<div className="flex flex-col gap-2">
									<Skeleton className="h-14" />
									<Skeleton className="h-14" />
								</div>
							) : latestMessages.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									No messages yet.
								</p>
							) : (
								<div className="flex flex-col gap-2">
									{latestMessages.map((msg) => (
										<div key={msg.id} className="border p-3">
											<div className="flex items-center justify-between gap-2">
												<p className="truncate font-medium text-sm">
													{msg.name || "Anonymous"}
												</p>
												<AdminPill variant={msg.isRead ? "default" : "warn"}>
													{msg.isRead ? "read" : "new"}
												</AdminPill>
											</div>
											<p className="mt-1 line-clamp-2 text-muted-foreground text-xs">
												{msg.message}
											</p>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
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
};

function SeoPublishPreview() {
	const [rows, setRows] = useState<EndpointStatus[]>([]);

	const endpoints = useMemo(
		() => [
			{ label: "Robots", url: "/robots.txt" },
			{ label: "Sitemap", url: "/sitemap.xml" },
			{ label: "RSS", url: "/rss.xml" },
			{ label: "OG site", url: `${ogBaseUrl}/site` },
			{ label: "Server sitemap", url: `${serverBaseUrl}/sitemap.xml` },
			{ label: "Server robots", url: `${serverBaseUrl}/robots.txt` },
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
					if (cancelled) return;
					setRows((prev) =>
						prev.map((row) =>
							row.url === endpoint.url
								? {
										...row,
										status: res.ok ? "ok" : "error",
										httpStatus: res.status,
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
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<RadioTowerIcon className="size-4" />
					Publish checks
				</CardTitle>
				<CardDescription>
					Robots, sitemap, RSS, and image endpoints.
				</CardDescription>
				<CardAction>
					<AdminActionLink to="/admin/seo">Preview OG</AdminActionLink>
				</CardAction>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				{rows.map((row) => (
					<div
						key={row.url}
						className="flex items-center justify-between gap-3 border px-3 py-2"
					>
						<div className="min-w-0">
							<p className="font-medium text-sm">{row.label}</p>
							<p className="truncate text-muted-foreground text-xs">
								{row.url}
							</p>
						</div>
						<AdminPill
							variant={
								row.status === "ok"
									? "success"
									: row.status === "error"
										? "destructive"
										: "default"
							}
						>
							{row.status === "checking"
								? "checking"
								: row.status === "ok"
									? `ok ${row.httpStatus ?? ""}`
									: `error ${row.httpStatus ?? ""}`}
						</AdminPill>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

function MetricCard({
	label,
	value,
	description,
	to,
	icon,
	loading,
	attention,
}: {
	label: string;
	value: number;
	description: string;
	to: string;
	icon: ReactNode;
	loading: boolean;
	attention?: boolean;
}) {
	return (
		<Link to={to as "/"}>
			<Card
				className={cn(
					"transition-colors hover:bg-muted/60",
					attention && "ring-primary/30",
				)}
			>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
						{icon}
						{label}
					</CardTitle>
					<CardAction>
						<ArrowRightIcon className="size-4" />
					</CardAction>
				</CardHeader>
				<CardContent>
					{loading ? (
						<Skeleton className="h-9 w-20" />
					) : (
						<p className="font-semibold text-4xl tracking-tight">{value}</p>
					)}
					<p className="mt-1 text-muted-foreground text-sm">{description}</p>
				</CardContent>
			</Card>
		</Link>
	);
}

function QueueItem({
	title,
	status,
	description,
	active,
	to,
}: {
	title: string;
	status: string;
	description: string;
	active: boolean;
	to: string;
}) {
	return (
		<Link
			to={to as "/"}
			className="border p-3 transition-colors hover:bg-muted"
		>
			<div className="flex items-center justify-between gap-3">
				<p className="font-medium text-sm">{title}</p>
				<AdminPill variant={active ? "warn" : "success"}>{status}</AdminPill>
			</div>
			<p className="mt-2 text-muted-foreground text-sm">{description}</p>
		</Link>
	);
}
