import type { PostMeta } from "@zias/content";
import { CATEGORY_COLOR_TOKEN, formatPostDate } from "@zias/content";
import { useState } from "react";
import { cn } from "../lib/utils";
import { AnimatedArrow } from "./animated-arrow";
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

export function PostCard({ post, onClick, className, variant }: PostCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const colorToken = variant ?? CATEGORY_COLOR_TOKEN[post.category];
	const ariaLabel = `${post.title} — ${post.category}, ${post.readTime} minute read${post.publishedAt ? `, ${formatPostDate(new Date(post.publishedAt))}` : ""}`;

	return (
		<button
			type="button"
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onFocus={() => setIsHovered(true)}
			onBlur={() => setIsHovered(false)}
			aria-label={ariaLabel}
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

				<span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
					<AnimatedArrow size={14} isHovered={isHovered} />
				</span>
			</div>
		</button>
	);
}
