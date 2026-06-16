import { Section, SectionInner } from "@zias/ui/components/section";
import { motion, useReducedMotion } from "motion/react";

const STATS = [
	{ label: "Based in", value: "Leuven, BE" },
	{ label: "Working on", value: "Projects with impact" },
	{ label: "Experience in", value: "Mobile, Web, UI/UX" },
] as const;

export function WhoAmISection() {
	const prefersReducedMotion = useReducedMotion();

	return (
		<Section
			id="whoami"
			variant="pink"
			className="min-h-svh lg:min-h-[min(100svh,760px)]"
			aria-labelledby="whoami-heading"
		>
			<SectionInner className="flex min-h-svh flex-col justify-center py-24 sm:py-32 lg:min-h-[min(100svh,760px)]">
				<div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-0">
					{/* Main copy */}
					<div className="lg:w-3/5">
						<motion.h2
							id="whoami-heading"
							className="font-display font-extrabold text-hero leading-tight"
							initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
							whileInView={
								prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
							}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
						>
							Hi! Nice to meet you.
						</motion.h2>

						<motion.p
							className="mt-8 max-w-lg text-section-pink-subtext text-subtext"
							initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
							whileInView={
								prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
							}
							viewport={{ once: true, margin: "-100px" }}
							transition={{
								duration: 0.6,
								delay: 0.1,
								ease: [0.16, 1, 0.3, 1],
							}}
						>
							I&apos;m Zias — a developer and designer building beautiful,
							considered software for people who care about{" "}
							<span
								className="font-[family-name:var(--font-hand)] text-[1.15em]"
								style={{ display: "inline-block", rotate: "-2deg" }}
							>
								the details
							</span>
							. Independent. Experienced. Available.
						</motion.p>
					</div>

					{/* Stats — semantic definition list, horizontal label/value layout */}
					<dl className="lg:ml-auto lg:w-[360px] xl:w-[420px]">
						{STATS.map(({ label, value }, i) => (
							<motion.div
								key={label}
								className="flex items-baseline justify-between gap-6 border-white/35 border-t border-dashed py-6 first:border-t-0"
								initial={
									prefersReducedMotion ? undefined : { opacity: 0, x: 20 }
								}
								whileInView={
									prefersReducedMotion ? undefined : { opacity: 1, x: 0 }
								}
								viewport={{ once: true, margin: "-80px" }}
								transition={{
									duration: 0.5,
									delay: i * 0.08,
									ease: [0.16, 1, 0.3, 1],
								}}
							>
								<dt className="shrink-0 font-semibold text-label text-section-pink-subtext uppercase tracking-widest">
									{label}
								</dt>
								<dd className="text-right font-bold font-display text-xl">
									{value}
								</dd>
							</motion.div>
						))}
					</dl>
				</div>
			</SectionInner>
		</Section>
	);
}
