import { Section, SectionInner } from "@zias/ui/components/section";
import { PillButton } from "@zias/ui/components/pill-button";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";

export function HeroSection() {
	const prefersReducedMotion = useReducedMotion();

	return (
		<Section variant="hero" className="min-h-svh overflow-hidden pt-[72px]" aria-label="Hero">
			{/* Gradient blobs — decorative, hidden from assistive tech */}
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				aria-hidden
			>
				{/* Magenta blob — top-left */}
				<motion.div
					className="absolute -top-[5%] -left-[10%] h-[55%] w-[70%] rounded-full"
					style={{
						background:
							"radial-gradient(ellipse at center, oklch(0.6 0.28 330 / 0.7) 0%, transparent 70%)",
						filter: "blur(60px)",
					}}
					animate={prefersReducedMotion ? undefined : { x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
					transition={{
						duration: 18,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
				{/* Amber blob — bottom-right */}
				<motion.div
					className="absolute -right-[5%] bottom-[5%] h-[60%] w-[65%] rounded-full"
					style={{
						background:
							"radial-gradient(ellipse at center, oklch(0.72 0.19 60 / 0.65) 0%, transparent 70%)",
						filter: "blur(80px)",
					}}
					animate={prefersReducedMotion ? undefined : { x: [0, -25, 15, 0], y: [0, 20, -15, 0] }}
					transition={{
						duration: 22,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: 3,
					}}
				/>
			</div>

			{/* Content */}
			<SectionInner className="relative flex min-h-[calc(100svh-72px)] flex-col justify-center py-16 sm:py-24">
				<motion.h1
					className="font-display font-extrabold text-mega text-section-hero-fg leading-[0.95] tracking-tight"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				>
					Crafting
					<br />
					Digital
					<br />
					experiences.
				</motion.h1>

				<motion.p
					className="mt-8 max-w-xl text-section-hero-subtext text-subtext"
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
				>
					A one-person studio building websites, web apps and mobile products
					for brands with taste. Quietly considered. Loudly shipped.
				</motion.p>

				<motion.div
					className="mt-10 flex flex-wrap items-center gap-5"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
				>
					<PillButton
						onClick={() =>
							document
								.getElementById("contact")
								?.scrollIntoView({ behavior: "smooth" })
						}
					>
						Start a project.
					</PillButton>
					<Link
						to="/journal"
						className="font-bold font-display text-section-hero-fg text-xl underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
					>
						See the work.
					</Link>
				</motion.div>
			</SectionInner>
		</Section>
	);
}
