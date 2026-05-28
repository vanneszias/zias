import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionInner } from "@zias/ui/components/section";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ogBaseUrl } from "@/lib/urls";

const SITE_URL = "https://zias.be";

export const Route = createFileRoute("/privacy")({
	head: () => ({
		meta: [
			{ title: "Privacy Policy — Zias" },
			{
				name: "description",
				content: "Privacy policy for zias.be and contact form data handling.",
			},
			{ property: "og:title", content: "Privacy Policy — Zias" },
			{
				property: "og:description",
				content: "Privacy policy for zias.be and contact form data handling.",
			},
			{ property: "og:url", content: `${SITE_URL}/privacy` },
			{ property: "og:image", content: `${ogBaseUrl}/privacy` },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:alt", content: "Privacy Policy — Zias" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: "Privacy Policy — Zias" },
			{
				name: "twitter:description",
				content: "Privacy policy for zias.be and contact form data handling.",
			},
			{ name: "twitter:image", content: `${ogBaseUrl}/privacy` },
			{ name: "twitter:image:alt", content: "Privacy Policy — Zias" },
		],
		links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
	}),
	component: PrivacyPage,
});

function PrivacyPage() {
	return (
		<>
			<Nav />
			<Section id="main-content" variant="hero" className="min-h-svh pt-[72px]">
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
									This is the personal website of Zias van Nes, a designer and
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
									This site uses OpenPanel analytics to understand page views,
									outgoing links, and interactions with tracked elements. This
									tracking happens in your browser and does not use the
									OpenPanel server-side client secret.
								</p>
								<p className="text-sm leading-relaxed">
									If you use the contact form, I store your name, email address,
									and message. This data is used solely to reply to your inquiry
									and is never shared with third parties.
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
									Under GDPR you have the right to access, rectify, or erase any
									personal data I hold about you. To exercise these rights,
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
									I may update this policy occasionally. The date at the top of
									the page reflects the most recent revision.
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
