import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionInner } from "@zias/ui/components/section";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

const SITE_URL = "https://zias.be";

export const Route = createFileRoute("/imprint")({
	head: () => ({
		meta: [
			{ title: "Imprint — Zias" },
			{
				name: "description",
				content: "Legal disclosure and imprint information for zias.be.",
			},
			{ property: "og:title", content: "Imprint — Zias" },
			{
				property: "og:description",
				content: "Legal disclosure and imprint information for zias.be.",
			},
			{ property: "og:url", content: `${SITE_URL}/imprint` },
		],
		links: [{ rel: "canonical", href: `${SITE_URL}/imprint` }],
	}),
	component: ImprintPage,
});

function ImprintPage() {
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
							Imprint
						</h1>
						<p className="mt-4 text-section-hero-subtext text-subtext">
							Legal disclosure pursuant to § 5 TMG / Art. 28 GDPR
						</p>

						<div className="mt-16 space-y-10 text-section-hero-fg/80">
							<section className="space-y-3">
								<h2 className="font-semibold text-lg text-section-hero-fg">
									Responsible person
								</h2>
								<address className="space-y-1 text-sm not-italic leading-relaxed">
									<p>Zias van Nes</p>
									<p>Leuven, Belgium</p>
									<p>
										<a
											href="mailto:hello@zias.be"
											className="underline underline-offset-2 hover:text-section-hero-fg"
										>
											hello@zias.be
										</a>
									</p>
									<p>
										<a
											href="https://zias.be"
											className="underline underline-offset-2 hover:text-section-hero-fg"
										>
											zias.be
										</a>
									</p>
								</address>
							</section>

							<section className="space-y-3">
								<h2 className="font-semibold text-lg text-section-hero-fg">
									Disclaimer
								</h2>
								<p className="text-sm leading-relaxed">
									The contents of this website have been compiled with the
									greatest possible care. However, I cannot guarantee the
									accuracy, completeness, or timeliness of the content.
								</p>
								<p className="text-sm leading-relaxed">
									Links to external websites are outside my control. I accept no
									responsibility for the content of linked pages.
								</p>
							</section>

							<section className="space-y-3">
								<h2 className="font-semibold text-lg text-section-hero-fg">
									Copyright
								</h2>
								<p className="text-sm leading-relaxed">
									All content on this site — writing, design, and code — is my
									own unless stated otherwise. Please ask before reproducing
									anything.
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
