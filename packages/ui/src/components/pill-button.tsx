"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { AnimatedArrow } from "./animated-arrow";

interface PillButtonProps extends ComponentPropsWithoutRef<"button"> {
	/** Visual size variant */
	size?: "sm" | "md";
}

/**
 * Animated pill CTA button — the arrow uses the shared AnimatedArrow so the
 * motion is identical to the PostCard arrow.
 */
export function PillButton({
	size = "md",
	className,
	children,
	...props
}: PillButtonProps) {
	const [isHovered, setIsHovered] = useState(false);
	const isSm = size === "sm";
	const arrowSize = isSm ? 16 : 28;

	return (
		<button
			type="button"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onFocus={() => setIsHovered(true)}
			onBlur={() => setIsHovered(false)}
			className={cn(
				"group inline-flex items-center gap-3 rounded-full bg-pill font-bold font-display text-pill-fg",
				"cursor-pointer select-none overflow-hidden transition-opacity hover:opacity-90 active:scale-[0.97]",
				isSm ? "px-5 py-2.5 text-base" : "px-8 py-4 text-xl md:text-2xl",
				className,
			)}
			{...props}
		>
			<span>{children}</span>
			<AnimatedArrow size={arrowSize} isHovered={isHovered} />
		</button>
	);
}
