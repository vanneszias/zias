import type { PostMeta } from "@zias/content";
import { CATEGORY_COLOR_TOKEN, formatPostDate } from "@zias/content";
import { cn } from "../lib/utils";
import { CategoryBadge } from "./category-badge";

/** Available background color variants for post cards */
export type PostCardVariant = "purple" | "rose" | "green" | "blue" | "orange";

const BG_CLASSES: Record<PostCardVariant, string> = {
	purple: "bg-card-words", // #6d5ac9
	rose: "bg-card-work", // #ee5cbf
	green: "bg-card-misc", // #27c41f
	blue: "bg-section-blue", // #2c86df
	orange: "bg-section-orange", // #ed4920
};

interface PostCardProps {
	post: PostMeta;
	/** Called when the card is clicked */
	onClick?: () => void;
	className?: string;
	/** Background color variant. If not provided, uses the category color. */
	variant?: PostCardVariant;
}

/**
 * Journal post card — used on the homepage selected-work grid and the journal listing.
 * Background color is derived from the post category by default, or can be overridden with variant.
 */
export function PostCard({ post, onClick, className, variant }: PostCardProps) {
	// Use explicit variant if provided, otherwise fall back to category color
	const colorToken = variant ?? CATEGORY_COLOR_TOKEN[post.category];
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-7",
				"text-left text-card-fg transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99]",
				BG_CLASSES[colorToken],
				className,
			)}
		>
			{/* Category */}
			<div>
				<CategoryBadge category={post.category} />
			</div>

			{/* Title */}
			<h3 className="mt-6 font-bold font-display text-xl leading-snug md:text-2xl">
				{post.title}
			</h3>

			{/* Bottom row: meta + arrow */}
			<div className="mt-6 flex items-end justify-between">
				<p className="font-medium text-label opacity-70">
					{post.publishedAt
						? formatPostDate(new Date(post.publishedAt))
						: "Draft"}{" "}
					· {post.readTime} min read
				</p>

				{/* Arrow circle */}
				<span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
					<svg
						width={14}
						height={14}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden
						role="presentation"
					>
						<path d="M7 17L17 7M17 7H7M17 7V17" />
					</svg>
				</span>
			</div>
		</button>
	);
}
