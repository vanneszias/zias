import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { PostMeta } from "@zias/content";
import { PostCard, type PostCardVariant } from "@zias/ui/components/post-card";
import { Section, SectionInner } from "@zias/ui/components/section";
import { motion, useReducedMotion } from "motion/react";
import { trpc } from "@/utils/trpc";

export function WorkSection() {
	const prefersReducedMotion = useReducedMotion();
	const { data: posts } = useQuery(
		trpc.journal.list.queryOptions({ limit: 4 }),
	);
	const navigate = useNavigate();

	// Cycle through color variants for visual variety (avoid blue since section is blue)
	const colorVariants: PostCardVariant[] = [
		"purple",
		"rose",
		"green",
		"orange",
	];

	return (
		<Section
			id="work"
			variant="blue"
			className="min-h-svh"
			aria-labelledby="work-heading"
		>
			<SectionInner className="flex min-h-svh flex-col justify-center py-24 sm:py-32">
				{/* Head */}
				<div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<motion.h2
							id="work-heading"
							className="font-display font-extrabold text-hero leading-tight"
							initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
							whileInView={
								prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
							}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
						>
							Selected work.
						</motion.h2>
						<motion.p
							className="mt-2 text-section-blue-subtext text-subtext"
							initial={prefersReducedMotion ? undefined : { opacity: 0 }}
							whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
						>
							And the{" "}
							<Link
								to="/journal"
								className="font-[family-name:var(--font-hand)] text-[1.15em] underline decoration-white/60 underline-offset-4"
								style={{ display: "inline-block", rotate: "-2deg" }}
							>
								writing
							</Link>{" "}
							around it.
						</motion.p>
					</div>

					<Link
						to="/journal"
						className="font-bold font-display text-xl underline decoration-white/40 underline-offset-4 transition-all hover:decoration-white"
					>
						Read the journal.
					</Link>
				</div>

				{/* Post grid */}
				<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
					{posts?.map((post, i) => (
						<motion.div
							key={post.id}
							initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
							whileInView={
								prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
							}
							viewport={{ once: true, margin: "-60px" }}
							transition={{
								duration: 0.5,
								delay: i * 0.07,
								ease: [0.16, 1, 0.3, 1],
							}}
						>
							<PostCard
								post={post as PostMeta}
								variant={colorVariants[i % colorVariants.length]}
								onClick={() =>
									navigate({
										to: "/journal/$slug",
										params: { slug: post.slug },
									})
								}
							/>
						</motion.div>
					))}

					{/* Skeleton cards while loading */}
					{!posts &&
						Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="h-64 animate-pulse rounded-2xl bg-white/10"
							/>
						))}
				</div>
			</SectionInner>
		</Section>
	);
}
