import { Link } from "@tanstack/react-router";
import { cn } from "@zias/ui/lib/utils";
import { AlignLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { SeriesManifest } from "@/lib/multi-page-manifest";

interface MultiPageSidebarProps {
	manifest: SeriesManifest;
	seriesSlug: string;
	currentPage: string;
	isOpen: boolean;
	onToggle: () => void;
	className?: string;
}

export function MultiPageSidebar({
	manifest,
	seriesSlug,
	currentPage,
	isOpen,
	onToggle,
	className,
}: MultiPageSidebarProps) {
	const currentIdx = manifest.pages.findIndex((p) => p.slug === currentPage);

	return (
		<aside
			className={cn(
				"sticky top-[72px] flex h-[calc(100vh-72px)] flex-col",
				"border-border border-r bg-background",
				"transition-[width] duration-300 ease-in-out",
				"shrink-0 overflow-hidden",
				isOpen ? "w-64 xl:w-72" : "w-12",
				className,
			)}
		>
			{/* Header row — always visible */}
			<div
				className={cn(
					"flex items-center border-border border-b",
					isOpen ? "justify-between px-4 py-3" : "justify-center py-3",
				)}
			>
				{isOpen && (
					<span className="flex items-center gap-2 font-display font-semibold text-foreground text-sm">
						<AlignLeft size={13} strokeWidth={2.5} />
						Chapters
					</span>
				)}
				<button
					type="button"
					onClick={onToggle}
					aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
					className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					{isOpen ? (
						<PanelLeftClose size={14} strokeWidth={2} />
					) : (
						<PanelLeftOpen size={14} strokeWidth={2} />
					)}
				</button>
			</div>

			{/* Chapter list — only when open */}
			{isOpen && (
				<nav
					className="flex-1 overflow-y-auto py-4"
					aria-label="Thesis chapters"
				>
					<ol className="relative px-3">
						{/* Continuous vertical line */}
						<li
							aria-hidden
							className="absolute top-3 bottom-3 left-[19px] w-px list-none bg-border"
						/>

						{manifest.pages.map((page, index) => {
							const isActive = page.slug === currentPage;
							const isPast = index < currentIdx;

							return (
								<li key={page.slug} className="relative">
									{/* Dot on the line */}
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
			)}

			{/* Collapsed: show current chapter number vertically */}
			{!isOpen && (
				<div className="flex flex-1 flex-col items-center justify-center gap-1 py-4">
					<span className="font-bold font-display text-foreground text-sm tabular-nums">
						{currentIdx + 1}
					</span>
					<span className="text-[10px] text-muted-foreground">/</span>
					<span className="text-muted-foreground text-xs tabular-nums">
						{manifest.pages.length}
					</span>
				</div>
			)}
		</aside>
	);
}
