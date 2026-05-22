import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { PostForm } from "@/components/post-form";
import { Nav } from "@/components/nav";
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
						<h1 className="font-display font-extrabold text-3xl">New post</h1>
					</div>
				</SectionInner>
			</Section>
			{/* Form on plain background */}
			<Section variant="plain">
				<SectionInner className="py-10">
					<div className="mx-auto max-w-3xl">
						<PostForm form={form} />
					</div>
				</SectionInner>
			</Section>
		</>
	);
}
