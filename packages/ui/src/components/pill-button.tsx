"use client";

import { motion, useAnimation } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/utils";

interface PillButtonProps extends ComponentPropsWithoutRef<"button"> {
	/** Visual size variant */
	size?: "sm" | "md";
}

/**
 * Animated pill CTA button — matches the Figma design's arrow-slide animation.
 * Hover: the arrow slides diagonally up-right, a ghost arrow enters from bottom-left.
 */
export function PillButton({
	size = "md",
	className,
	children,
	...props
}: PillButtonProps) {
	const controls = useAnimation();

	const isSm = size === "sm";
	const arrowSize = isSm ? 16 : 28;

	return (
		<button
			type="button"
			onMouseEnter={() => controls.start("hovered")}
			onMouseLeave={() => controls.start("idle")}
			onFocus={() => controls.start("hovered")}
			onBlur={() => controls.start("idle")}
			className={cn(
				"group inline-flex items-center gap-3 rounded-full bg-pill font-bold font-display text-pill-fg",
				"cursor-pointer select-none overflow-hidden transition-opacity hover:opacity-90 active:scale-[0.97]",
				isSm ? "px-5 py-2.5 text-base" : "px-8 py-4 text-xl md:text-2xl",
				className,
			)}
			{...props}
		>
			<span>{children}</span>

			{/* Arrow container — clips the exit/enter animation */}
			<span
				className="relative overflow-hidden"
				style={{ width: arrowSize, height: arrowSize }}
			>
				{/* Primary arrow — exits top-right on hover */}
				<motion.span
					className="absolute inset-0 flex items-center justify-center"
					variants={{
						idle: { x: 0, y: 0, opacity: 1 },
						hovered: { x: arrowSize * 0.6, y: -arrowSize * 0.6, opacity: 0 },
					}}
					initial="idle"
					animate={controls}
					transition={{ type: "spring", stiffness: 500, damping: 30 }}
				>
					<ArrowIcon size={arrowSize} />
				</motion.span>

				{/* Ghost arrow — enters from bottom-left on hover */}
				<motion.span
					className="absolute inset-0 flex items-center justify-center"
					variants={{
						idle: { x: -arrowSize * 0.6, y: arrowSize * 0.6, opacity: 0 },
						hovered: { x: 0, y: 0, opacity: 1 },
					}}
					initial="idle"
					animate={controls}
					transition={{ type: "spring", stiffness: 500, damping: 30 }}
				>
					<ArrowIcon size={arrowSize} />
				</motion.span>
			</span>
		</button>
	);
}

function ArrowIcon({ size }: { size: number }) {
	return (
		<svg
			width={size}
			height={size}
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
	);
}
