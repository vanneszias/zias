import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { PostCategory } from "@zias/content";
import { formatPostDate } from "@zias/content";
import { CategoryBadge } from "@zias/ui/components/category-badge";
import { Section, SectionInner } from "@zias/ui/components/section";
import { lazy, Suspense } from "react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { trpc } from "@/utils/trpc";

const SITE_URL = "https://zias.be";

export const Route = createFileRoute("/journal/$slug")({
	loader: ({ context: { queryClient }, params }) =>
		queryClient.ensureQueryData(trpc.journal.bySlug.queryOptions(params.slug)),

	head: ({ loaderData: post }) => {
		if (!post) return {};

		const title = `${post.title} — Zias`;
		const description = post.excerpt || "An article by Zias";
		const url = `${SITE_URL}/journal/${post.slug}`;
		const serverUrl = import.meta.env.VITE_SERVER_URL as string;
		const ogImage = `${serverUrl}/og/journal/${post.slug}`;

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ property: "og:type", content: "article" },
				{ property: "og:title", content: post.title },
				{ property: "og:description", content: description },
				{ property: "og:url", content: url },
				{ property: "og:image", content: ogImage },
				{ property: "og:image:width", content: "1200" },
				{ property: "og:image:height", content: "630" },
				{ property: "og:site_name", content: "Zias" },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: post.title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: ogImage },
				...(post.publishedAt
					? [
							{
								property: "article:published_time",
								content: new Date(post.publishedAt).toISOString(),
							},
						]
					: []),
			],
			links: [{ rel: "canonical", href: url }],
		};
	},

	component: PostPage,
});

/**
 * Vite glob import of all custom React post pages.
 * Any file at src/content/journal/[slug].tsx is automatically picked up.
 * The post DB record must have isCustomPage: true for this path to be used.
 */
const customPages = import.meta.glob<{ default: React.ComponentType }>(
	"../../content/journal/*.tsx",
);

function PostPage() {
	const { slug } = Route.useParams();
	const {
		data: post,
		isLoading,
		error,
	} = useQuery(trpc.journal.bySlug.queryOptions(slug));

	if (isLoading) {
		return (
			<>
				<Nav />
				<Section variant="hero" className="min-h-svh pt-[72px]">
					<SectionInner className="py-24">
						<div className="h-10 w-48 animate-pulse rounded-lg bg-white/10" />
						<div className="mt-6 h-24 w-3/4 animate-pulse rounded-lg bg-white/10" />
					</SectionInner>
				</Section>
				<Footer />
			</>
		);
	}

	if (error || !post) throw notFound();

	/* Custom React page — dynamically import the component */
	if (post.isCustomPage) {
		const importFn = customPages[`../../content/journal/${post.slug}.tsx`];
		if (importFn) {
			const CustomPage = lazy(importFn);
			return (
				<Suspense fallback={<PostSkeleton />}>
					<Nav />
					<CustomPage />
					<Footer />
				</Suspense>
			);
		}
	}

	/* Default: Tiptap JSON renderer */
	return (
		<>
			<Nav />
			<Section id="main-content" variant="hero" className="pt-[72px]">
				<SectionInner className="py-24">
					{/* Meta header */}
					<div className="mb-8 flex flex-col gap-4">
						<Link
							to="/journal"
							className="inline-flex w-fit items-center gap-2 font-display font-semibold text-section-hero-subtext text-sm underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
						>
							← All articles
						</Link>
						<h1 className="max-w-3xl font-display font-extrabold text-4xl leading-tight md:text-5xl lg:text-6xl">
							{post.title}
						</h1>
						<p className="text-section-hero-subtext text-sm">
							{post.publishedAt
								? formatPostDate(new Date(post.publishedAt))
								: "Draft"}{" "}
							· {post.readTime} min read
						</p>
						<CategoryBadge category={post.category as PostCategory} short />
					</div>
				</SectionInner>
			</Section>

			{/* Content in a light section for readability */}
			<Section variant="plain">
				<SectionInner className="py-16">
					<div className="mx-auto max-w-2xl">
						{post.content ? (
							<TiptapRenderer content={post.content} />
						) : (
							<p className="text-muted-foreground">No content yet.</p>
						)}
					</div>
				</SectionInner>
			</Section>
			<Footer />
		</>
	);
}

function PostSkeleton() {
	return (
		<>
			<Nav />
			<Section variant="hero" className="min-h-svh pt-[72px]">
				<SectionInner className="py-24">
					<div className="h-10 w-48 animate-pulse rounded-lg bg-white/10" />
				</SectionInner>
			</Section>
			<Footer />
		</>
	);
}
