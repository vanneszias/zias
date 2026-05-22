import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionInner } from "@zias/ui/components/section";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/privacy")({
	component: PrivacyPage,
});

function PrivacyPage() {
	return (
		<>
			<Nav />
			<Section variant="hero" className="min-h-svh pt-[72px]">
				<SectionInner className="py-24">
					<div className="max-w-2xl">
						<Link
							to="/"
							className="mb-10 inline-flex items-center gap-1.5 font-medium text-section-hero-subtext text-sm transition-colors hover:text-section-hero-fg"
						>
							← Back
						</Link>

						<h1 className="mt-4 font-display font-extrabold text-hero leading-tight">
							Privacy Policy
						</h1>
						<p className="mt-4 text-section-hero-subtext text-subtext">
							Last updated: May 2026
						</p>

						<div className="prose-legal mt-16 space-y-10 text-section-hero-fg/80">
							<section className="space-y-3">
								<h2 className="font-semibold text-lg text-section-hero-fg">
									Who I am
								</h2>
								<p className="text-sm leading-relaxed">
									This is the personal website of Zias Vannes, a designer and
									developer based in Leuven, Belgium. You can reach me at{" "}
									<a
										href="mailto:hello@zias.be"
										className="underline underline-offset-2 hover:text-section-hero-fg"
									>
										hello@zias.be
									</a>
									.
								</p>
							</section>

							<section className="space-y-3">
								<h2 className="font-semibold text-lg text-section-hero-fg">
									What data I collect
								</h2>
								<p className="text-sm leading-relaxed">
									This site does not use analytics, tracking pixels, or
									third-party cookies. No personal data is collected passively
									from visitors.
								</p>
								<p className="text-sm leading-relaxed">
									If you use the contact form, I store your name, email address,
									and message. This data is used solely to reply to your
									inquiry and is never shared with third parties.
								</p>
							</section>

							<section className="space-y-3">
								<h2 className="font-semibold text-lg text-section-hero-fg">
									Hosting & infrastructure
								</h2>
								<p className="text-sm leading-relaxed">
									This site is hosted on Cloudflare. Cloudflare may process
									request metadata (IP address, browser headers) as part of
									their network infrastructure. See{" "}
									<a
										href="https://www.cloudflare.com/privacypolicy/"
										target="_blank"
										rel="noopener noreferrer"
										className="underline underline-offset-2 hover:text-section-hero-fg"
									>
										Cloudflare's privacy policy
									</a>{" "}
									for details.
								</p>
							</section>

							<section className="space-y-3">
								<h2 className="font-semibold text-lg text-section-hero-fg">
									Your rights
								</h2>
								<p className="text-sm leading-relaxed">
									Under GDPR you have the right to access, rectify, or erase
									any personal data I hold about you. To exercise these rights,
									email me at{" "}
									<a
										href="mailto:hello@zias.be"
										className="underline underline-offset-2 hover:text-section-hero-fg"
									>
										hello@zias.be
									</a>
									.
								</p>
							</section>

							<section className="space-y-3">
								<h2 className="font-semibold text-lg text-section-hero-fg">
									Changes
								</h2>
								<p className="text-sm leading-relaxed">
									I may update this policy occasionally. The date at the top
									of the page reflects the most recent revision.
								</p>
							</section>
						</div>
					</div>
				</SectionInner>
			</Section>
			<Footer />
		</>
	);
}
