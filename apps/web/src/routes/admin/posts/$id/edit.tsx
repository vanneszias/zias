import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import type { PostCategory } from "@zias/content";
import { generateSlug, POST_CATEGORIES } from "@zias/content";
import { toast } from "sonner";
import { z } from "zod";
import { AdminShell } from "@/components/admin-shell";
import { PostForm, type PostFormValues } from "@/components/post-form";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/admin/posts/$id/edit")({
	component: EditPost,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) throw redirect({ to: "/admin/login" });
	},
});

function EditPost() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const qc = useQueryClient();

	const { data: posts } = useQuery(trpc.journal.adminList.queryOptions());
	const post = posts?.find((p) => p.id === id);

	const { mutateAsync } = useMutation(trpc.journal.update.mutationOptions());

	if (!post) {
		return (
			<AdminShell title="Edit post" backTo="/admin/posts" backLabel="Posts">
				<p className="text-section-hero-subtext">Post not found.</p>
			</AdminShell>
		);
	}

	return (
		<AdminShell
			title="Edit post"
			description="Update metadata and content before publishing."
			backTo="/admin/posts"
			backLabel="Posts"
			actions={
				<a
					href={`/journal/${post.slug}`}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 font-semibold text-section-hero-fg text-sm transition-colors hover:bg-white/20 focus-visible:outline-none"
				>
					View live
				</a>
			}
		>
			<div className="mx-auto max-w-4xl">
				<EditPostForm
					post={post}
					onSave={async (values) => {
						await mutateAsync({
							id,
							...values,
							slug: values.slug || generateSlug(values.title),
						});
						qc.invalidateQueries({ queryKey: ["journal"] });
						toast.success("Post saved");
						navigate({ to: "/admin/posts" });
					}}
				/>
			</div>
		</AdminShell>
	);
}

function EditPostForm({
	post,
	onSave,
}: {
	post: {
		title: string;
		category: string;
		excerpt: string | null;
		slug: string;
		isCustomPage: boolean;
		isDraft: boolean;
		content: string | null;
		publishedAt: string | Date | null;
	};
	onSave: (values: PostFormValues) => Promise<void>;
}) {
	const schema = z.object({
		title: z.string().min(1),
		category: z.enum(POST_CATEGORIES),
		excerpt: z.string().max(500),
		slug: z.string(),
		isCustomPage: z.boolean(),
		isDraft: z.boolean(),
		content: z.string().nullable(),
		publishedAt: z.string().nullable(),
	});

	const form = useForm({
		defaultValues: {
			title: post.title,
			category: post.category as PostCategory,
			excerpt: post.excerpt ?? "",
			slug: post.slug,
			isCustomPage: post.isCustomPage,
			isDraft: post.isDraft,
			content: post.content ?? null,
			publishedAt: post.publishedAt
				? new Date(post.publishedAt).toISOString().split("T")[0]
				: null,
		},
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			await onSave(value);
		},
	});

	return <PostForm form={form} />;
}
