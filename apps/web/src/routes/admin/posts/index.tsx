import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import type { PostCategory } from "@zias/content";
import { formatPostDate } from "@zias/content";
import { CategoryBadge } from "@zias/ui/components/category-badge";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
	AdminActionLink,
	AdminPill,
	AdminShell,
} from "@/components/admin-shell";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/admin/posts/")({
	component: AdminPostsList,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) throw redirect({ to: "/admin/login" });
	},
});

function AdminPostsList() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "draft" | "published"
	>("all");
	const [sortBy, setSortBy] = useState<"updated" | "title">("updated");
	const {
		data: posts,
		isLoading,
		isError,
		refetch,
	} = useQuery(trpc.journal.adminList.queryOptions());
	const { mutateAsync: deletePost } = useMutation(
		trpc.journal.delete.mutationOptions(),
	);

	async function handleDelete(id: string, title: string) {
		if (!confirm(`Delete "${title}"?`)) return;
		await deletePost(id);
		qc.invalidateQueries({ queryKey: ["journal"] });
		toast.success("Post deleted");
	}

	const filteredPosts = useMemo(() => {
		const base = (posts ?? []).filter((post) => {
			const matchesQuery =
				query.length === 0 ||
				post.title.toLowerCase().includes(query.toLowerCase()) ||
				post.slug.toLowerCase().includes(query.toLowerCase());

			const matchesStatus =
				statusFilter === "all"
					? true
					: statusFilter === "draft"
						? post.isDraft
						: !post.isDraft;

			return matchesQuery && matchesStatus;
		});

		return base.sort((a, b) => {
			if (sortBy === "title") return a.title.localeCompare(b.title);
			const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
			const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
			return bTime - aTime;
		});
	}, [posts, query, sortBy, statusFilter]);

	return (
		<AdminShell
			title="Posts"
			description="Manage publishing with fast filters and quick edit actions."
			backTo="/admin"
			backLabel="Admin"
			actions={
				<AdminActionLink to="/admin/posts/new" strong>
					New post
				</AdminActionLink>
			}
		>
			<div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					data-admin-search
					placeholder="Search title or slug"
					className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-section-hero-fg text-sm placeholder:text-section-hero-fg/50 focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/30"
				/>
				<select
					value={statusFilter}
					onChange={(e) =>
						setStatusFilter(e.target.value as "all" | "draft" | "published")
					}
					className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-section-hero-fg text-sm focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/30"
				>
					<option value="all">All statuses</option>
					<option value="draft">Drafts only</option>
					<option value="published">Published only</option>
				</select>
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value as "updated" | "title")}
					className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-section-hero-fg text-sm focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/30"
				>
					<option value="updated">Sort: latest activity</option>
					<option value="title">Sort: title</option>
				</select>
			</div>

			{isError ? (
				<div className="mb-6 rounded-2xl border border-red-300/35 bg-red-300/10 p-4 text-red-100">
					<p className="font-semibold">Could not load posts.</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="mt-2 rounded-full border border-red-200/40 px-3 py-1.5 text-xs transition-colors hover:bg-red-300/15 focus-visible:outline-none"
					>
						Retry
					</button>
				</div>
			) : null}

			{isLoading && (
				<div className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="h-16 animate-pulse rounded-xl bg-white/10"
						/>
					))}
				</div>
			)}

			<div className="mb-3 flex items-center justify-between text-section-hero-subtext text-sm">
				<p>{filteredPosts.length} results</p>
				{query ? <p>Query: {query}</p> : null}
			</div>

			<div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
				{filteredPosts.map((post) => (
					<div
						key={post.id}
						className="flex flex-col gap-4 bg-white/5 p-4 transition-colors hover:bg-white/10 sm:flex-row sm:items-center"
					>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<CategoryBadge
									category={post.category as PostCategory}
									className="shrink-0"
								/>
								{post.isDraft ? (
									<AdminPill variant="warn">Draft</AdminPill>
								) : (
									<AdminPill variant="success">Published</AdminPill>
								)}
								{post.isCustomPage && <AdminPill>Custom</AdminPill>}
							</div>
							<p className="mt-1 truncate font-medium text-section-hero-fg">
								{post.title}
							</p>
							<p className="text-section-hero-subtext text-xs sm:text-sm">
								{post.publishedAt
									? formatPostDate(new Date(post.publishedAt))
									: "Draft"}{" "}
								· {post.readTime} min read · /{post.slug}
							</p>
						</div>
						<div className="flex w-full shrink-0 gap-2 sm:w-auto">
							<button
								type="button"
								onClick={() =>
									navigate({
										to: "/admin/posts/$id/edit",
										params: { id: post.id },
									})
								}
								className="flex-1 rounded-full border border-white/20 px-3 py-2 text-section-hero-fg text-sm transition-colors hover:bg-white/10 focus-visible:outline-none sm:flex-none"
							>
								Edit
							</button>
							<button
								type="button"
								onClick={() => handleDelete(post.id, post.title)}
								className="flex-1 rounded-full border border-white/20 px-3 py-2 text-section-hero-fg/60 text-sm transition-colors hover:border-red-400/40 hover:text-red-400 focus-visible:outline-none sm:flex-none"
							>
								Delete
							</button>
						</div>
					</div>
				))}
				{filteredPosts.length === 0 && (
					<div className="p-8 text-center">
						<p className="font-semibold text-section-hero-fg">
							No posts found.
						</p>
						<p className="mt-1 text-section-hero-subtext text-sm">
							Try another filter or create a new post.
						</p>
					</div>
				)}
			</div>
		</AdminShell>
	);
}
