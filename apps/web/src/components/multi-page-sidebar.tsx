import { cn } from "@zias/ui/lib/utils";
import { AlignLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import type { SeriesManifest } from "@/lib/multi-page-manifest";
import type { PageHeadingsBySlug } from "./multi-page-layout";

interface MultiPageSidebarProps {
	manifest: SeriesManifest;
	seriesSlug: string;
	currentPage: string;
	basePath?: string;
	activeHeadingId: string | null;
	headingsByPage: PageHeadingsBySlug;
	className?: string;
}

export function MultiPageSidebar({
	manifest,
	seriesSlug,
	currentPage,
	basePath = `/journal/${seriesSlug}`,
	activeHeadingId,
	headingsByPage,
	className,
}: MultiPageSidebarProps) {
	const currentIdx = manifest.pages.findIndex((p) => p.slug === currentPage);
	const chapterPages = manifest.pages.filter((page) => page.slug !== "index");
	const currentChapterIdx = chapterPages.findIndex(
		(p) => p.slug === currentPage,
	);
	const pageProgressLabel =
		currentPage === "index"
			? "Index"
			: `Chapter ${currentChapterIdx + 1} of ${chapterPages.length}`;
	const activeItemRef = useRef<HTMLAnchorElement | null>(null);
	const activeNavKey = `${currentPage}:${activeHeadingId ?? ""}`;
	const getPageHref = (slug: string) =>
		slug === "index" ? basePath : `${basePath}/${slug}`;

	useEffect(() => {
		void activeNavKey;
		activeItemRef.current?.scrollIntoView({
			block: "center",
			inline: "nearest",
		});
	}, [activeNavKey]);

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
	};

	return (
		<aside
			className={cn(
				"group/sidebar fixed top-28 right-4 bottom-6 z-30 flex w-64 flex-col overflow-hidden rounded-2xl xl:right-6",
				"border border-border/70 bg-background/75 shadow-foreground/5 shadow-lg backdrop-blur-md",
				"transition-[width,background-color,box-shadow] duration-300 ease-out",
				"hover:w-80 hover:bg-background/95 hover:shadow-xl",
				"focus-within:w-80 focus-within:bg-background/95 focus-within:shadow-xl",
				className,
			)}
		>
			<div className="flex h-12 items-center gap-3 border-border/70 border-b px-3">
				<span className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors group-focus-within/sidebar:text-foreground group-hover/sidebar:text-foreground">
					<AlignLeft size={13} strokeWidth={2.5} />
				</span>
				<div className="min-w-0">
					<p className="font-display font-semibold text-foreground text-sm">
						Chapters
					</p>
					<p className="truncate text-muted-foreground text-xs opacity-70 transition-opacity duration-200 group-focus-within/sidebar:opacity-100 group-hover/sidebar:opacity-100">
						{manifest.seriesTitle}
					</p>
				</div>
			</div>

			<nav className="flex-1 overflow-y-auto py-4" aria-label="Thesis chapters">
				<ol className="relative px-3">
					<li
						aria-hidden
						className="absolute top-3 bottom-3 left-[11px] w-px list-none bg-border"
					/>

					{manifest.pages.map((page, index) => {
						const isActive = page.slug === currentPage;
						const isPast = index < currentIdx;
						const headings = headingsByPage[page.slug] ?? [];
						const activeChapterRef = isActive && !activeHeadingId;
						const chapterIndex = chapterPages.findIndex(
							(chapterPage) => chapterPage.slug === page.slug,
						);

						return (
							<li key={page.slug} className="relative">
								<div
									aria-hidden
									className={cn(
										"absolute top-[15px] left-[7px] size-[9px] rounded-full ring-4 ring-background/80 transition-colors",
										isActive
											? "bg-foreground"
											: isPast
												? "bg-muted-foreground/55"
												: "bg-border",
									)}
								/>

								<a
									ref={activeChapterRef ? activeItemRef : undefined}
									href={getPageHref(page.slug)}
									aria-current={isActive ? "page" : undefined}
									className={cn(
										"block rounded-md py-2 pr-3 pl-8 text-sm leading-snug outline-none transition-colors focus-visible:bg-muted focus-visible:text-foreground",
										isActive
											? "font-semibold text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									<span className="flex min-w-0 items-baseline gap-1.5">
										{page.slug !== "index" && (
											<span className="text-muted-foreground/60 text-xs tabular-nums">
												{chapterIndex + 1}.
											</span>
										)}
										<span className="truncate">
											{page.shortTitle ?? page.title}
										</span>
									</span>
								</a>

								{headings.length > 0 && (
									<ol className="flex flex-col gap-0.5 pb-2 pl-8">
										{headings.map((heading) => {
											const isActiveHeading =
												isActive && heading.id === activeHeadingId;

											return (
												<li key={heading.id}>
													<a
														ref={isActiveHeading ? activeItemRef : undefined}
														href={`${getPageHref(page.slug)}#${heading.id}`}
														onClick={(event) => {
															if (page.slug === currentPage) {
																scrollToCurrentPageHeading(event, heading.id);
															}
														}}
														className={cn(
															"block truncate rounded-md py-1 pr-3 text-muted-foreground text-xs leading-snug outline-none transition-colors hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground group-focus-within/sidebar:whitespace-normal group-hover/sidebar:whitespace-normal",
															isActiveHeading &&
																"bg-muted font-medium text-foreground",
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

			<div className="border-border/70 border-t px-3 py-3">
				<p className="truncate text-muted-foreground text-xs">
					{pageProgressLabel}
				</p>
			</div>
		</aside>
	);
}
