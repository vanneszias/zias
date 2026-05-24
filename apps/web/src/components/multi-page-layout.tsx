import { Link } from "@tanstack/react-router";
import { Section, SectionInner } from "@zias/ui/components/section";
import { cn } from "@zias/ui/lib/utils";
import { AlignLeft, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { SeriesManifest } from "@/lib/multi-page-manifest";
import { MultiPageSidebar } from "./multi-page-sidebar";

interface MultiPageLayoutProps {
	manifest: SeriesManifest;
	seriesSlug: string;
	pageSlug: string;
	children: React.ReactNode;
}

export function MultiPageLayout({
	manifest,
	seriesSlug,
	pageSlug,
	children,
}: MultiPageLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

	const pageIdx = manifest.pages.findIndex((p) => p.slug === pageSlug);
	const currentPage = manifest.pages[pageIdx];
	const prevPage = pageIdx > 0 ? manifest.pages[pageIdx - 1] : null;
	const nextPage =
		pageIdx < manifest.pages.length - 1 ? manifest.pages[pageIdx + 1] : null;

	return (
		<>
			{/* ── Chapter header (full-width hero) ──────────────────── */}
			<Section id="main-content" variant="hero" className="pt-[72px]">
				<SectionInner className="py-10 md:py-12">
					<div className="flex items-center justify-between">
						<Link
							to="/journal"
							className="inline-flex items-center gap-1.5 font-medium text-section-hero-subtext text-sm underline decoration-white/30 underline-offset-4 transition-colors hover:text-section-hero-fg hover:decoration-white"
						>
							← Journal
						</Link>

						{/* Mobile: chapters button */}
						<button
							type="button"
							onClick={() => setMobileDrawerOpen(true)}
							className="flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 font-medium text-section-hero-fg/80 text-sm transition-colors hover:border-white/50 hover:text-section-hero-fg lg:hidden"
						>
							<AlignLeft size={13} strokeWidth={2.5} />
							Chapters
						</button>
					</div>

					<p className="mt-8 font-display font-semibold text-section-hero-subtext text-xs uppercase tracking-widest">
						Chapter {pageIdx + 1} of {manifest.pages.length}
					</p>
					<h1 className="mt-2 font-display font-extrabold text-3xl leading-tight md:text-5xl">
						{currentPage.title}
					</h1>
					{manifest.subtitle && (
						<p className="mt-2 text-section-hero-subtext/70 text-sm">
							{manifest.subtitle}
						</p>
					)}
				</SectionInner>
			</Section>

			{/* ── Body: desktop sidebar + content ───────────────────── */}
			<div className="flex items-start">
				{/* Desktop sidebar */}
				<MultiPageSidebar
					manifest={manifest}
					seriesSlug={seriesSlug}
					currentPage={pageSlug}
					isOpen={sidebarOpen}
					onToggle={() => setSidebarOpen((v) => !v)}
					className="hidden lg:flex"
				/>

				{/* Main content column */}
				<div className="min-w-0 flex-1">
					<div className="px-6 py-16 md:px-12 xl:px-16">
						<article
							className={cn(
								"mx-auto max-w-2xl",
								"prose prose-lg prose-neutral dark:prose-invert max-w-none",
								"prose-headings:font-bold prose-headings:font-display prose-headings:tracking-tight",
								"prose-h2:mt-12 prose-h3:mt-8 prose-h2:text-2xl prose-h3:text-xl",
								"prose-p:leading-relaxed",
								"prose-strong:font-semibold",
								"prose-a:font-medium prose-a:underline prose-a:underline-offset-4",
								"prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
								"prose-pre:rounded-xl prose-pre:bg-neutral-950 prose-pre:text-neutral-100 prose-pre:text-sm",
								"prose-thead:border-b prose-th:font-semibold prose-table:text-sm",
								"prose-blockquote:border-foreground/20 prose-blockquote:border-l-2 prose-blockquote:text-foreground/70 prose-blockquote:not-italic",
								"prose-li:my-1",
							)}
						>
							{children}
						</article>
					</div>

					{/* Prev / Next navigation */}
					<div className="px-6 pb-16 md:px-12 xl:px-16">
						<div className="mx-auto max-w-2xl border-border border-t pt-8">
							<div className="flex items-start justify-between gap-4">
								{prevPage ? (
									<Link
										to="/journal/$slug/$page"
										params={{ slug: seriesSlug, page: prevPage.slug }}
										className="group flex flex-col gap-1 rounded-xl border border-border p-4 transition-colors hover:bg-muted md:w-52"
									>
										<span className="font-medium text-muted-foreground text-xs">
											← Previous
										</span>
										<span className="font-display font-semibold text-foreground text-sm group-hover:underline">
											{prevPage.shortTitle ?? prevPage.title}
										</span>
									</Link>
								) : (
									<span />
								)}
								{nextPage ? (
									<Link
										to="/journal/$slug/$page"
										params={{ slug: seriesSlug, page: nextPage.slug }}
										className="group ml-auto flex flex-col gap-1 rounded-xl border border-border p-4 text-right transition-colors hover:bg-muted md:w-52"
									>
										<span className="font-medium text-muted-foreground text-xs">
											Next →
										</span>
										<span className="font-display font-semibold text-foreground text-sm group-hover:underline">
											{nextPage.shortTitle ?? nextPage.title}
										</span>
									</Link>
								) : (
									<span />
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ── Mobile drawer ──────────────────────────────────────── */}
			<AnimatePresence>
				{mobileDrawerOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							key="backdrop"
							className="fixed inset-0 z-40 bg-black/50 lg:hidden"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={() => setMobileDrawerOpen(false)}
						/>

						{/* Drawer panel */}
						<motion.div
							key="drawer"
							className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background shadow-2xl lg:hidden"
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
						>
							{/* Drawer header */}
							<div className="flex items-center justify-between border-border border-b px-4 py-3">
								<span className="flex items-center gap-2 font-display font-semibold text-foreground text-sm">
									<AlignLeft size={13} strokeWidth={2.5} />
									Chapters
								</span>
								<button
									type="button"
									onClick={() => setMobileDrawerOpen(false)}
									aria-label="Close chapters"
									className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								>
									<X size={14} strokeWidth={2} />
								</button>
							</div>

							{/* Series title */}
							<div className="border-border border-b px-4 py-3">
								<p className="font-display font-semibold text-foreground/80 text-xs leading-snug">
									{manifest.seriesTitle}
								</p>
							</div>

							{/* Chapter list */}
							<nav
								className="flex-1 overflow-y-auto py-4"
								aria-label="Thesis chapters"
							>
								<ol className="relative px-3">
									<li
										aria-hidden
										className="absolute top-3 bottom-3 left-[19px] w-px list-none bg-border"
									/>

									{manifest.pages.map((page, index) => {
										const isActive = page.slug === pageSlug;
										const isPast = index < pageIdx;

										return (
											<li key={page.slug} className="relative">
												<div
													aria-hidden
													className={cn(
														"absolute top-[13px] left-[13px] size-[7px] rounded-full ring-2 ring-background transition-colors",
														isActive
															? "bg-foreground"
															: isPast
																? "bg-muted-foreground/50"
																: "bg-border",
													)}
												/>
												<Link
													to="/journal/$slug/$page"
													params={{ slug: seriesSlug, page: page.slug }}
													onClick={() => setMobileDrawerOpen(false)}
													className={cn(
														"block rounded-md py-2 pr-2 pl-8 text-sm leading-snug transition-colors",
														isActive
															? "font-semibold text-foreground"
															: "text-muted-foreground hover:text-foreground",
													)}
												>
													<span className="mr-1.5 text-muted-foreground/60 text-xs tabular-nums">
														{index + 1}.
													</span>
													{page.shortTitle ?? page.title}
												</Link>
											</li>
										);
									})}
								</ol>
							</nav>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
