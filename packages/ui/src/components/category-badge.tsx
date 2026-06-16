import type { PostCategory } from "@zias/content";
import { CATEGORY_COLOR_TOKEN, CATEGORY_LABELS } from "@zias/content";
import { cn } from "../lib/utils";

/** Category dot color — only used in "on-light" variant where the bg is neutral */
const DOT_CLASSES: Record<"words" | "work" | "misc", string> = {
  words: "bg-card-words",
  work: "bg-card-work",
  misc: "bg-card-misc",
};

interface CategoryBadgeProps {
  category: PostCategory;
  className?: string;
  /**
   * "on-color" (default) — frosted white chip for use on saturated section /
   * card backgrounds. Dot is solid white (card color already signals category).
   *
   * "on-light" — dark chip for use on neutral / white surfaces. Dot uses the
   * actual category color.
   */
  variant?: "on-color" | "on-light";
  /** Show only the specific type, dropping the group prefix ("Work · Essay" → "Essay") */
  short?: boolean;
}

export function CategoryBadge({
  category,
  className,
  variant = "on-color",
  short = false,
}: CategoryBadgeProps) {
  const token = CATEGORY_COLOR_TOKEN[category];
  const fullLabel = CATEGORY_LABELS[category];
  const label = short ? (fullLabel.split(" · ")[1] ?? fullLabel) : fullLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 font-semibold text-label uppercase tracking-widest",
        variant === "on-color"
          ? "border border-white/20 bg-white/10 text-white"
          : "border border-black/12 bg-black/8 text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          variant === "on-color" ? "bg-white/80" : DOT_CLASSES[token],
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}
