import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import type { PostMeta } from "@zias/content";
import { CATEGORY_LABELS, POST_CATEGORIES } from "@zias/content";
import { PostCard, type PostCardVariant } from "@zias/ui/components/post-card";
import { Section, SectionInner } from "@zias/ui/components/section";
import { cn } from "@zias/ui/lib/utils";
import { z } from "zod";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ogBaseUrl } from "@/lib/urls";
import { trpc } from "@/utils/trpc";

const searchSchema = z.object({
	category: z.enum(POST_CATEGORIES).optional(),
});

const SITE_URL = "https://zias.be";

export const Route = createFileRoute("/journal/")({
	validateSearch: searchSchema,
	head: () => ({
		meta: [
			{ title: "Journal — Zias" },
			{
				name: "description",
				content: "Writing, case studies, and notes from the work.",
			},
			{ property: "og:title", content: "Journal — Zias" },
			{
				property: "og:description",
				content: "Writing, case studies, and notes from the work.",
			},
			{ property: "og:url", content: `${SITE_URL}/journal` },
			{ property: "og:image", content: `${ogBaseUrl}/journal` },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:alt", content: "Journal — Zias" },
			{ name: "twitter:title", content: "Journal — Zias" },
			{
				name: "twitter:description",
				content: "Writing, case studies, and notes from the work.",
			},
			{ name: "twitter:image", content: `${ogBaseUrl}/journal` },
			{ name: "twitter:image:alt", content: "Journal — Zias" },
		],
		links: [{ rel: "canonical", href: `${SITE_URL}/journal` }],
	}),
	component: JournalPage,
});

function JournalPage() {
	const { category } = useSearch({ from: "/journal/" });
	const navigate = useNavigate({ from: "/journal/" });

	const {
		data: posts,
		isLoading,
		isError,
		refetch,
	} = useQuery(trpc.journal.list.queryOptions({ category, limit: 50 }));

	// Cycle through color variants for visual variety (avoid purple since hero is purple)
	const colorVariants: PostCardVariant[] = ["rose", "green", "blue", "orange"];
	const getVariant = (index: number): PostCardVariant =>
		colorVariants[index % colorVariants.length];

	return (
		<>
			<Nav />
			<Section id="main-content" variant="hero" className="min-h-svh pt-[72px]">
				<SectionInner className="py-24">
					{/* Header */}
					<h1 className="font-display font-extrabold text-hero leading-tight">
						The Journal.
					</h1>
					<p className="mt-4 text-section-hero-subtext text-subtext">
						Writing, case studies, and notes from the work.
					</p>

					{/* Category filter */}
					<div className="mt-10 flex flex-wrap gap-2">
						<FilterChip
							active={!category}
							onClick={() => navigate({ search: {} })}
						>
							All
						</FilterChip>
						{POST_CATEGORIES.map((cat) => (
							<FilterChip
								key={cat}
								active={category === cat}
								onClick={() => navigate({ search: { category: cat } })}
							>
								{CATEGORY_LABELS[cat]}
							</FilterChip>
						))}
					</div>

					{/* Grid */}
					<div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{isError ? (
							<div className="col-span-full rounded-2xl border border-white/25 bg-black/20 p-6 text-center text-section-hero-fg">
								<p className="font-semibold">Could not load articles.</p>
								<button
									type="button"
									onClick={() => refetch()}
									className="mt-3 rounded-full border border-white/30 px-4 py-1.5 text-sm transition-colors hover:bg-white/10 focus-visible:outline-none"
								>
									Retry
								</button>
							</div>
						) : null}
						{isLoading &&
							Array.from({ length: 6 }).map((_, i) => (
								<div
									key={i}
									className="h-64 animate-pulse rounded-2xl bg-white/10"
								/>
							))}
						{posts?.map((post, index) => (
							<PostCard
								key={post.id}
								post={post as PostMeta}
								onClick={() =>
									navigate({
										to: "/journal/$slug",
										params: { slug: post.slug },
									})
								}
								variant={getVariant(index)}
								className={index === 0 ? "sm:col-span-2 lg:col-span-3" : ""}
							/>
						))}
						{posts?.length === 0 && (
							<div className="col-span-full rounded-2xl border border-white/20 bg-white/5 p-6 text-center">
								<p className="font-semibold text-section-hero-fg">
									No posts found.
								</p>
								<p className="mt-1 text-section-hero-subtext text-sm">
									Try another category or check back soon.
								</p>
							</div>
						)}
					</div>
				</SectionInner>
			</Section>
			<Footer />
		</>
	);
}

function FilterChip({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"rounded-full border px-4 py-1.5 font-semibold text-label uppercase tracking-widest transition-colors",
				active
					? "border-white bg-white text-section-hero"
					: "border-white/30 bg-transparent text-section-hero-fg/80 hover:border-white/60 hover:text-section-hero-fg",
			)}
		>
			{children}
		</button>
	);
}
