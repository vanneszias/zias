import { Section, SectionInner } from "@zias/ui/components/section";
import { cn } from "@zias/ui/lib/utils";
import { AlignLeft, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SeriesManifest } from "@/lib/multi-page-manifest";
import { MultiPageSidebar } from "./multi-page-sidebar";

export interface PageHeading {
	id: string;
	text: string;
	level: 2 | 3;
}

export type PageHeadingsBySlug = Record<string, PageHeading[]>;

const chapterSources = import.meta.glob<string>("../content/journal/*/*.tsx", {
	eager: true,
	query: "?raw",
	import: "default",
});

function slugifyHeading(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/&amp;/g, "and")
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

function extractHeadingText(value: string) {
	return value
		.replace(/<[^>]+>/g, "")
		.replace(/\{\s*"\s*"\s*\}/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/\s+/g, " ")
		.trim();
}

function extractHeadings(source: string): PageHeading[] {
	const headingMatches = source.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/g);
	const slugCounts = new Map<string, number>();

	return Array.from(headingMatches)
		.map((match) => {
			const text = extractHeadingText(match[2] ?? "");
			if (!text) return null;

			const baseId = slugifyHeading(text) || "section";
			const count = slugCounts.get(baseId) ?? 0;
			slugCounts.set(baseId, count + 1);

			return {
				id: count ? `${baseId}-${count + 1}` : baseId,
				text,
				level: Number(match[1]) as 2 | 3,
			};
		})
		.filter((heading): heading is PageHeading => Boolean(heading));
}

function getHeadingsForSeries(seriesSlug: string): PageHeadingsBySlug {
	return Object.fromEntries(
		Object.entries(chapterSources)
			.filter(([path]) => path.includes(`/journal/${seriesSlug}/`))
			.map(([path, source]) => {
				const pageSlug =
					path
						.split("/")
						.pop()
						?.replace(/\.tsx$/, "") ?? "";
				return [pageSlug, extractHeadings(source)];
			}),
	);
}

interface MultiPageLayoutProps {
	manifest: SeriesManifest;
	seriesSlug: string;
	pageSlug: string;
	basePath?: string;
	parentHref?: string;
	parentLabel?: string;
	children: React.ReactNode;
}

export function MultiPageLayout({
	manifest,
	seriesSlug,
	pageSlug,
	basePath = `/journal/${seriesSlug}`,
	parentHref = "/journal",
	parentLabel = "Journal",
	children,
}: MultiPageLayoutProps) {
	const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
	const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
	const articleRef = useRef<HTMLElement>(null);
	const mobileActiveItemRef = useRef<HTMLAnchorElement | null>(null);
	const scrolledHashRef = useRef<string | null>(null);

	const pageIdx = manifest.pages.findIndex((p) => p.slug === pageSlug);
	const currentPage = manifest.pages[pageIdx];
	const chapterPages = manifest.pages.filter((page) => page.slug !== "index");
	const currentChapterIdx = chapterPages.findIndex((p) => p.slug === pageSlug);
	const pageProgressLabel =
		pageSlug === "index"
			? "Index"
			: `Chapter ${currentChapterIdx + 1} of ${chapterPages.length}`;
	const prevPage = pageIdx > 0 ? manifest.pages[pageIdx - 1] : null;
	const nextPage =
		pageIdx < manifest.pages.length - 1 ? manifest.pages[pageIdx + 1] : null;
	const headingsByPage = useMemo(
		() => getHeadingsForSeries(seriesSlug),
		[seriesSlug],
	);
	const currentHeadings = headingsByPage[pageSlug] ?? [];
	const activeMobileNavKey = `${pageSlug}:${activeHeadingId ?? ""}`;
	const getPageHref = (slug: string) =>
		slug === "index" ? basePath : `${basePath}/${slug}`;

	useEffect(() => {
		if (!mobileDrawerOpen) return;
		void activeMobileNavKey;

		requestAnimationFrame(() => {
			mobileActiveItemRef.current?.scrollIntoView({
				block: "center",
				inline: "nearest",
			});
		});
	}, [mobileDrawerOpen, activeMobileNavKey]);

	useEffect(() => {
		const article = articleRef.current;
		if (!article) return;
		scrolledHashRef.current = null;

		const updateActiveHeading = () => {
			const headingElements = Array.from(
				article.querySelectorAll<HTMLElement>("h2, h3"),
			);
			const activeHeading = headingElements
				.filter((heading) => heading.getBoundingClientRect().top <= 130)
				.at(-1);

			setActiveHeadingId(activeHeading?.id ?? null);
		};

		const applyHeadingIds = () => {
			Array.from(article.querySelectorAll("h2, h3")).forEach(
				(heading, index) => {
					const id = currentHeadings[index]?.id;
					if (!id) return;

					heading.id = id;
					(heading as HTMLElement).style.scrollMarginTop = "96px";
				},
			);
			updateActiveHeading();

			const hashId = decodeURIComponent(window.location.hash.slice(1));
			if (!hashId || scrolledHashRef.current === hashId) return;

			const hashTarget = document.getElementById(hashId);
			if (!hashTarget) return;

			scrolledHashRef.current = hashId;
			requestAnimationFrame(() => {
				hashTarget.scrollIntoView({ block: "start" });
			});
		};

		applyHeadingIds();

		let animationFrame = 0;
		const scheduleActiveHeadingUpdate = () => {
			cancelAnimationFrame(animationFrame);
			animationFrame = requestAnimationFrame(updateActiveHeading);
		};

		const observer = new MutationObserver(applyHeadingIds);

		observer.observe(article, { childList: true, subtree: true });
		window.addEventListener("scroll", scheduleActiveHeadingUpdate, {
			passive: true,
		});
		window.addEventListener("resize", scheduleActiveHeadingUpdate);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(animationFrame);
			window.removeEventListener("scroll", scheduleActiveHeadingUpdate);
			window.removeEventListener("resize", scheduleActiveHeadingUpdate);
		};
	}, [currentHeadings]);

	const scrollToCurrentPageHeading = (
		event: React.MouseEvent<HTMLAnchorElement>,
		headingId: string,
	) => {
		event.preventDefault();
		document.getElementById(headingId)?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
		history.pushState(null, "", `#${headingId}`);
		setMobileDrawerOpen(false);
	};

	return (
		<>
			{/* ── Chapter header (full-width hero) ──────────────────── */}
			<Section id="main-content" variant="hero" className="pt-[72px]">
				<SectionInner className="py-10 md:py-12">
					<div className="flex items-center justify-between">
						<a
							href={parentHref}
							className="inline-flex items-center gap-1.5 font-medium text-section-hero-subtext text-sm underline decoration-white/30 underline-offset-4 transition-colors hover:text-section-hero-fg hover:decoration-white"
						>
							← {parentLabel}
						</a>

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
						{pageProgressLabel}
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

			{/* Desktop sidebar */}
			<MultiPageSidebar
				manifest={manifest}
				seriesSlug={seriesSlug}
				currentPage={pageSlug}
				basePath={basePath}
				activeHeadingId={activeHeadingId}
				headingsByPage={headingsByPage}
				className="hidden lg:flex"
			/>

			<button
				type="button"
				onClick={() => setMobileDrawerOpen(true)}
				aria-label="Open chapters"
				className="fixed right-4 bottom-4 z-30 flex items-center gap-1.5 rounded-full border border-border bg-background/85 px-3 py-2 font-medium text-foreground text-sm shadow-foreground/10 shadow-lg backdrop-blur-md transition-colors hover:bg-background lg:hidden"
			>
				<AlignLeft size={13} strokeWidth={2.5} />
				Chapters
			</button>

			<Section variant="plain">
				<SectionInner className="py-16">
					<div className="mx-auto max-w-2xl">
						<article
							ref={articleRef}
							className={cn(
								"prose prose-lg prose-neutral dark:prose-invert max-w-none",
								"prose-headings:font-bold prose-headings:font-display prose-headings:tracking-tight",
								"prose-h2:mt-12 prose-h3:mt-8 prose-h2:text-2xl prose-h3:text-xl",
								"prose-p:leading-relaxed",
								"prose-strong:font-semibold",
								"prose-a:font-medium prose-a:underline prose-a:underline-offset-4",
								"prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
								"prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:border prose-pre:border-border prose-pre:bg-slate-950 prose-pre:p-5 prose-pre:text-slate-100 prose-pre:text-sm prose-pre:shadow-foreground/10 prose-pre:shadow-lg dark:prose-pre:border-white/10 dark:prose-pre:bg-neutral-950 dark:prose-pre:text-neutral-100",
								"[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-mono [&_pre_code]:text-inherit [&_pre_code]:leading-relaxed",
								"prose-thead:border-b prose-th:font-semibold prose-table:text-sm",
								"prose-blockquote:border-foreground/20 prose-blockquote:border-l-2 prose-blockquote:text-foreground/70 prose-blockquote:not-italic",
								"prose-li:my-1",
							)}
						>
							{children}
						</article>

						{/* Prev / Next navigation */}
						<div className="mt-16 border-border border-t pt-8">
							<div className="flex items-start justify-between gap-4">
								{prevPage ? (
									<a
										href={getPageHref(prevPage.slug)}
										className="group flex flex-col gap-1 rounded-xl border border-border p-4 transition-colors hover:bg-muted md:w-52"
									>
										<span className="font-medium text-muted-foreground text-xs">
											← Previous
										</span>
										<span className="font-display font-semibold text-foreground text-sm group-hover:underline">
											{prevPage.shortTitle ?? prevPage.title}
										</span>
									</a>
								) : (
									<span />
								)}
								{nextPage ? (
									<a
										href={getPageHref(nextPage.slug)}
										className="group ml-auto flex flex-col gap-1 rounded-xl border border-border p-4 text-right transition-colors hover:bg-muted md:w-52"
									>
										<span className="font-medium text-muted-foreground text-xs">
											Next →
										</span>
										<span className="font-display font-semibold text-foreground text-sm group-hover:underline">
											{nextPage.shortTitle ?? nextPage.title}
										</span>
									</a>
								) : (
									<span />
								)}
							</div>
						</div>
					</div>
				</SectionInner>
			</Section>

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
										const pageHeadings = headingsByPage[page.slug] ?? [];
										const activeChapterRef = isActive && !activeHeadingId;
										const chapterIndex = chapterPages.findIndex(
											(chapterPage) => chapterPage.slug === page.slug,
										);

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
												<a
													ref={
														activeChapterRef ? mobileActiveItemRef : undefined
													}
													href={getPageHref(page.slug)}
													onClick={() => setMobileDrawerOpen(false)}
													className={cn(
														"block rounded-md py-2 pr-2 pl-8 text-sm leading-snug transition-colors",
														isActive
															? "font-semibold text-foreground"
															: "text-muted-foreground hover:text-foreground",
													)}
												>
													{page.slug !== "index" && (
														<span className="mr-1.5 text-muted-foreground/60 text-xs tabular-nums">
															{chapterIndex + 1}.
														</span>
													)}
													{page.shortTitle ?? page.title}
												</a>
												{pageHeadings.length > 0 && (
													<ol className="flex flex-col gap-0.5 pb-2 pl-8">
														{pageHeadings.map((heading) => {
															const isActiveHeading =
																page.slug === pageSlug &&
																heading.id === activeHeadingId;

															return (
																<li key={heading.id}>
																	<a
																		ref={
																			isActiveHeading
																				? mobileActiveItemRef
																				: undefined
																		}
																		href={`${getPageHref(page.slug)}#${heading.id}`}
																		onClick={(event) => {
																			if (page.slug === pageSlug) {
																				scrollToCurrentPageHeading(
																					event,
																					heading.id,
																				);
																				return;
																			}

																			setMobileDrawerOpen(false);
																		}}
																		className={cn(
																			"block rounded-md py-1 pr-2 text-muted-foreground text-xs leading-snug transition-colors hover:text-foreground",
																			isActiveHeading &&
																				"font-medium text-foreground",
																			heading.level === 3 && "pl-3",
																		)}
																	>
																		{heading.text}
																	</a>
																</li>
															);
														})}
													</ol>
												)}
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
