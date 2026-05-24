import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import type { PostCategory } from "@zias/content";
import { generateSlug, POST_CATEGORIES } from "@zias/content";
import { toast } from "sonner";
import { z } from "zod";
import { AdminActionLink, AdminShell } from "@/components/admin-shell";
import { PostForm } from "@/components/post-form";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/admin/posts/new")({
	component: NewPost,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) throw redirect({ to: "/admin/login" });
	},
});

const schema = z.object({
	title: z.string().min(1, "Title required"),
	category: z.enum(POST_CATEGORIES),
	excerpt: z.string().max(500),
	slug: z.string(),
	isCustomPage: z.boolean(),
	isDraft: z.boolean(),
	content: z.string().nullable(),
	publishedAt: z.string().nullable(),
});

function NewPost() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { mutateAsync } = useMutation(trpc.journal.create.mutationOptions());

	const form = useForm({
		defaultValues: {
			title: "",
			category: "words:essay" as PostCategory,
			excerpt: "",
			slug: "",
			isCustomPage: false,
			isDraft: true,
			content: null as string | null,
			publishedAt: null as string | null,
		},
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			const post = await mutateAsync({
				...value,
				slug: value.slug || generateSlug(value.title),
			});
			qc.invalidateQueries({ queryKey: ["journal"] });
			toast.success("Post created");
			navigate({ to: "/admin/posts/$id/edit", params: { id: post.id } });
		},
	});

	return (
		<AdminShell
			title="New post"
			description="Create content and keep drafts organized."
			backTo="/admin/posts"
			backLabel="Posts"
			actions={<AdminActionLink to="/admin/messages">Messages</AdminActionLink>}
		>
			<div className="max-w-5xl">
				<PostForm form={form} />
			</div>
		</AdminShell>
	);
}
