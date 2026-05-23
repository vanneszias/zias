import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { PillButton } from "@zias/ui/components/pill-button";
import { Section, SectionInner } from "@zias/ui/components/section";

export function Footer() {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const handleSayHi = () => {
		if (pathname === "/") {
			document
				.getElementById("contact")
				?.scrollIntoView({ behavior: "smooth" });
		} else {
			navigate({ to: "/", hash: "contact" });
		}
	};

	return (
		<Section as="footer" variant="footer">
			<SectionInner className="py-20">
				{/* Top row */}
				<div className="flex flex-col gap-16 md:flex-row md:gap-0">
					{/* Lead CTA */}
					<div className="flex flex-col gap-8 md:w-72 md:shrink-0">
						<p className="font-bold font-display text-2xl leading-tight">
							Still here?
							<br />
							Then say hi.
						</p>
						<p className="font-body text-section-footer-subtext text-sm leading-relaxed">
							One person. One inbox. Usually a reply by tomorrow morning over
							coffee.
						</p>
						<div>
							<PillButton size="sm" onClick={handleSayHi}>
								Say Hi!
							</PillButton>
						</div>
					</div>

					{/* Columns */}
					<div className="grid grid-cols-2 gap-10 md:ml-auto">
						{/* Elsewhere */}
						<FooterCol title="Elsewhere">
							<FooterLink
								href="mailto:hello@zias.be"
								icon={
									<svg
										width="14"
										height="14"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.25"
										viewBox="0 0 14 12"
										aria-hidden="true"
									>
										<rect x="1" y="1" width="12" height="10" rx="1.5" />
										<path d="M1 3.5L7 7l6-3.5" />
									</svg>
								}
							>
								Email
							</FooterLink>
							<FooterLink
								href="https://linkedin.com/in/ziasvannes"
								external
								icon={
									<svg
										width="14"
										height="14"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.25"
										viewBox="0 0 14 14"
										aria-hidden="true"
									>
										<rect x="1.5" y="1.5" width="11" height="11" rx="2" />
										<path d="M4.5 6v4.5M7.5 10.5V8.5a2 2 0 014 0v2" />
										<circle
											cx="4.5"
											cy="4.25"
											r="0.65"
											fill="currentColor"
											stroke="none"
										/>
									</svg>
								}
							>
								LinkedIn
							</FooterLink>
							<FooterLink
								href="https://x.com/ziasvannes"
								external
								icon={
									<svg
										width="14"
										height="14"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.5"
										viewBox="0 0 14 14"
										aria-hidden="true"
									>
										<path d="M1.5 1.5l11 11M12.5 1.5l-11 11" />
									</svg>
								}
							>
								Twitter / X
							</FooterLink>
							<FooterLink
								href="https://instagram.com/ziasvannes"
								external
								icon={
									<svg
										width="14"
										height="14"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.25"
										viewBox="0 0 14 14"
										aria-hidden="true"
									>
										<rect x="1.5" y="1.5" width="11" height="11" rx="3.25" />
										<circle cx="7" cy="7" r="2.75" />
										<circle
											cx="10.5"
											cy="3.5"
											r="0.7"
											fill="currentColor"
											stroke="none"
										/>
									</svg>
								}
							>
								Instagram
							</FooterLink>
						</FooterCol>

						{/* Also on */}
						<FooterCol title="Also on">
							<FooterLink
								href="https://git.zias.be/zias/zias"
								external
								icon={
									<svg
										width="14"
										height="14"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.25"
										viewBox="0 0 14 14"
										aria-hidden="true"
									>
										<circle cx="4" cy="3.5" r="1.5" />
										<circle cx="4" cy="10.5" r="1.5" />
										<circle cx="10" cy="5.5" r="1.5" />
										<path
											d="M4 5V9M4.5 4.5Q7 4.5 10 6.5"
											strokeLinecap="round"
										/>
									</svg>
								}
							>
								Git
							</FooterLink>
							<FooterLink
								href="https://ziasbe.substack.com/"
								external
								icon={
									<svg
										width="14"
										height="14"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.25"
										viewBox="0 0 14 14"
										aria-hidden="true"
									>
										<path d="M2 3.5h10M2 7h10" />
										<path d="M4.5 10l2.5 2.5L9.5 10z" strokeLinejoin="round" />
									</svg>
								}
							>
								Substack
							</FooterLink>
							<FooterLink
								href="https://letterboxd.com/ziasvannes"
								external
								icon={
									<svg
										width="14"
										height="14"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.25"
										viewBox="0 0 14 14"
										aria-hidden="true"
									>
										<circle cx="5.5" cy="7" r="4" />
										<circle cx="8.5" cy="7" r="4" />
									</svg>
								}
							>
								Letterboxd
							</FooterLink>
						</FooterCol>
					</div>
				</div>

				{/* Wordmark — skeletal outline treatment */}
				<div className="mt-16 overflow-hidden" aria-hidden>
					<p
						className="select-none font-display font-extrabold leading-none tracking-tighter"
						style={{
							fontSize: "clamp(4rem, 14vw, 14rem)",
							WebkitTextStroke: "1px rgba(255,255,255,0.18)",
							color: "transparent",
						}}
					>
						zias.be
					</p>
				</div>

				{/* Bottom bar */}
				<div className="mt-8 flex items-center justify-between border-white/10 border-t pt-6 text-section-footer-subtext text-xs">
					<span>© 2026 Zias · Leuven, BE</span>
					<div className="flex gap-6">
						<Link
							to="/privacy"
							className="transition-colors hover:text-section-footer-fg"
						>
							Privacy
						</Link>
						<Link
							to="/imprint"
							className="transition-colors hover:text-section-footer-fg"
						>
							Imprint
						</Link>
						<a
							href="/rss.xml"
							className="transition-colors hover:text-section-footer-fg"
						>
							RSS
						</a>
					</div>
				</div>
			</SectionInner>
		</Section>
	);
}

function FooterCol({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<nav aria-label={title}>
			<p className="mb-4 font-semibold text-label text-section-footer-subtext uppercase tracking-widest">
				{title}
			</p>
			<ul className="space-y-3">{children}</ul>
		</nav>
	);
}

function FooterLink({
	href,
	external,
	icon,
	children,
}: {
	href: string;
	external?: boolean;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<li>
			<a
				href={href}
				{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
				className="inline-flex items-center gap-1.5 font-medium text-section-footer-fg/80 text-sm transition-colors hover:text-section-footer-fg"
			>
				<span className="text-section-footer-subtext">{icon}</span>
				{children}
			</a>
		</li>
	);
}
