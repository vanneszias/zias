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
import { trpc } from "@/utils/trpc";

const searchSchema = z.object({
	category: z.enum(POST_CATEGORIES).optional(),
});

export const Route = createFileRoute("/journal/")({
	validateSearch: searchSchema,
	component: JournalPage,
});

function JournalPage() {
	const { category } = useSearch({ from: "/journal/" });
	const navigate = useNavigate({ from: "/journal/" });

	const { data: posts, isLoading } = useQuery(
		trpc.journal.list.queryOptions({ category, limit: 50 }),
	);

	// Cycle through color variants for visual variety (avoid purple since hero is purple)
	const colorVariants: PostCardVariant[] = ["rose", "green", "blue", "orange"];
	const getVariant = (index: number): PostCardVariant =>
		colorVariants[index % colorVariants.length];

	return (
		<>
			<Nav />
			<Section variant="hero" className="min-h-svh pt-[72px]">
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
							<p className="col-span-full text-section-hero-subtext">
								No posts yet.
							</p>
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
					: "border-white/30 bg-transparent text-section-hero-fg/70 hover:border-white/60 hover:text-section-hero-fg",
			)}
		>
			{children}
		</button>
	);
}
