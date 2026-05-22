import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import type { PostCategory } from "@zias/content";
import { generateSlug, POST_CATEGORIES } from "@zias/content";
import { Section, SectionInner } from "@zias/ui/components/section";
import { toast } from "sonner";
import { z } from "zod";
import { PostForm, type PostFormValues } from "@/components/post-form";
import { Nav } from "@/components/nav";
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
			<>
				<Nav />
				<Section variant="hero" className="min-h-svh pt-[72px]">
					<SectionInner className="flex items-center py-24">
						<p className="text-section-hero-subtext">Post not found.</p>
					</SectionInner>
				</Section>
			</>
		);
	}

	return (
		<>
			<Nav />
			{/* Hero header */}
			<Section variant="hero" className="pt-[72px]">
				<SectionInner className="py-10">
					<div className="flex items-center gap-4">
						<Link
							to="/admin/posts"
							className="text-section-hero-subtext text-sm transition-colors hover:text-section-hero-fg"
						>
							← Posts
						</Link>
						<h1 className="font-display font-extrabold text-3xl">Edit post</h1>
						<a
							href={`/journal/${post.slug}`}
							target="_blank"
							rel="noopener noreferrer"
							className="ml-auto text-section-hero-subtext text-sm transition-colors hover:text-section-hero-fg"
						>
							View live ↗
						</a>
					</div>
				</SectionInner>
			</Section>
			{/* Form on plain background */}
			<Section variant="plain">
				<SectionInner className="py-10">
					<div className="mx-auto max-w-3xl">
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
				</SectionInner>
			</Section>
		</>
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
		},
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			await onSave(value);
		},
	});

	return <PostForm form={form} />;
}
