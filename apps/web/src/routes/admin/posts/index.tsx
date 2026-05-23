import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import type { PostCategory } from "@zias/content";
import { formatPostDate } from "@zias/content";
import { CategoryBadge } from "@zias/ui/components/category-badge";
import { Section, SectionInner } from "@zias/ui/components/section";
import { toast } from "sonner";
import { Nav } from "@/components/nav";
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
	const { data: posts, isLoading } = useQuery(
		trpc.journal.adminList.queryOptions(),
	);
	const { mutateAsync: deletePost } = useMutation(
		trpc.journal.delete.mutationOptions(),
	);

	async function handleDelete(id: string, title: string) {
		if (!confirm(`Delete "${title}"?`)) return;
		await deletePost(id);
		qc.invalidateQueries({ queryKey: ["journal"] });
		toast.success("Post deleted");
	}

	return (
		<>
			<Nav />
			<Section variant="hero" className="min-h-svh pt-[72px]">
				<SectionInner className="py-24">
					<div className="mb-8 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link
								to="/admin"
								className="text-section-hero-subtext text-sm transition-colors hover:text-section-hero-fg"
							>
								← Admin
							</Link>
							<h1 className="font-display font-extrabold text-3xl">Posts</h1>
						</div>
						<Link
							to="/admin/posts/new"
							className="rounded-full bg-white px-5 py-2 font-bold font-display text-section-hero text-sm transition-opacity hover:opacity-90"
						>
							New post →
						</Link>
					</div>

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

					<div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
						{posts?.map((post) => (
							<div
								key={post.id}
								className="flex items-center gap-4 bg-white/5 p-4 transition-colors hover:bg-white/10"
							>
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<CategoryBadge
											category={post.category as PostCategory}
											className="shrink-0"
										/>
										{post.isDraft && (
											<span className="rounded-full border border-white/20 px-2 py-0.5 text-section-hero-fg/60 text-xs">
												Draft
											</span>
										)}
										{post.isCustomPage && (
											<span className="rounded-full border border-white/20 px-2 py-0.5 text-section-hero-fg/60 text-xs">
												Custom
											</span>
										)}
									</div>
									<p className="mt-1 truncate font-medium text-section-hero-fg">
										{post.title}
									</p>
									<p className="text-section-hero-subtext text-xs">
										{post.publishedAt
											? formatPostDate(new Date(post.publishedAt))
											: "Draft"}{" "}
										· {post.readTime} min read · /{post.slug}
									</p>
								</div>
								<div className="flex shrink-0 gap-2">
									<button
										type="button"
										onClick={() =>
											navigate({
												to: "/admin/posts/$id/edit",
												params: { id: post.id },
											})
										}
										className="rounded-full border border-white/20 px-3 py-1.5 text-section-hero-fg text-sm transition-colors hover:bg-white/10"
									>
										Edit
									</button>
									<button
										type="button"
										onClick={() => handleDelete(post.id, post.title)}
										className="rounded-full border border-white/20 px-3 py-1.5 text-section-hero-fg/60 text-sm transition-colors hover:border-red-400/40 hover:text-red-400"
									>
										Delete
									</button>
								</div>
							</div>
						))}
						{posts?.length === 0 && (
							<p className="p-8 text-center text-section-hero-subtext">
								No posts yet.
							</p>
						)}
					</div>
				</SectionInner>
			</Section>
		</>
	);
}
