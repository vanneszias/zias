import { Section, SectionInner } from "@zias/ui/components/section";
import { motion } from "motion/react";

const STATS = [
	{ label: "Based in", value: "Leuven, BE" },
	{ label: "Working on", value: "Projects with impact" },
	{ label: "Experience in", value: "Mobile, Web, UI/UX" },
] as const;

export function WhoAmISection() {
	return (
		<Section id="whoami" variant="pink" className="min-h-svh">
			<SectionInner className="flex min-h-svh flex-col justify-center py-32">
				<div className="flex flex-col gap-20 lg:flex-row lg:items-start lg:gap-0">
					{/* Main copy */}
					<div className="lg:w-3/5">
						<motion.h2
							className="font-display font-extrabold text-hero leading-tight"
							initial={{ opacity: 0, y: 32 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
						>
							Hi! Nice to meet you.
						</motion.h2>

						<motion.p
							className="mt-8 max-w-2xl text-section-pink-subtext text-subtext"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{
								duration: 0.6,
								delay: 0.1,
								ease: [0.16, 1, 0.3, 1],
							}}
						>
							I&apos;m Zias — a developer and designer building beautiful,
							considered software for people who care about{" "}
							<span className="underline decoration-white/60 underline-offset-4">
								the details
							</span>
							. Independent. Experienced. Available.
						</motion.p>
					</div>

					{/* Stats aside */}
					<div className="lg:ml-auto lg:w-[280px]">
						{STATS.map(({ label, value }, i) => (
							<motion.div
								key={label}
								className="flex flex-col gap-1 border-white/20 border-t py-6 first:border-t-0"
								initial={{ opacity: 0, x: 20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: "-80px" }}
								transition={{
									duration: 0.5,
									delay: i * 0.08,
									ease: [0.16, 1, 0.3, 1],
								}}
							>
								<span className="font-semibold text-label text-section-pink-subtext uppercase tracking-widest">
									{label}
								</span>
								<span className="font-bold font-display text-xl">{value}</span>
							</motion.div>
						))}
					</div>
				</div>
			</SectionInner>
		</Section>
	);
}
