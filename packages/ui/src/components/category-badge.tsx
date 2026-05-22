import type { PostCategory } from "@zias/content";
import { CATEGORY_COLOR_TOKEN, CATEGORY_LABELS } from "@zias/content";
import { cn } from "../lib/utils";

const DOT_CLASSES: Record<"words" | "work" | "misc", string> = {
	words: "bg-card-words",
	work: "bg-card-work",
	misc: "bg-card-misc",
};

interface CategoryBadgeProps {
	category: PostCategory;
	className?: string;
}

/** Small pill badge with a colored dot + category label. */
export function CategoryBadge({ category, className }: CategoryBadgeProps) {
	const token = CATEGORY_COLOR_TOKEN[category];
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border border-current/20 px-3 py-1 font-medium text-label uppercase tracking-widest",
				className,
			)}
		>
			<span
				className={cn("h-1.5 w-1.5 rounded-full", DOT_CLASSES[token])}
				aria-hidden
			/>
			{CATEGORY_LABELS[category]}
		</span>
	);
}
