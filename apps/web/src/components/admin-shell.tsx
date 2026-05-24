import {
	formatForDisplay,
	useHotkey,
	useHotkeySequence,
} from "@tanstack/react-hotkeys";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { buttonVariants } from "@zias/ui/components/button";
import { cn } from "@zias/ui/lib/utils";
import {
	FileTextIcon,
	ImageIcon,
	InboxIcon,
	LayoutDashboardIcon,
	PlusIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type AdminShellProps = {
	title: string;
	description?: string;
	backTo?: string;
	backLabel?: string;
	actions?: ReactNode;
	children: ReactNode;
};

const adminNav = [
	{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboardIcon,
		shortcut: "G D",
	},
	{ to: "/admin/posts", label: "Posts", icon: FileTextIcon, shortcut: "G P" },
	{
		to: "/admin/messages",
		label: "Messages",
		icon: InboxIcon,
		shortcut: "G M",
	},
	{ to: "/admin/seo", label: "SEO", icon: ImageIcon, shortcut: "G S" },
];

export function AdminShell({
	title,
	description,
	backTo,
	backLabel,
	actions,
	children,
}: AdminShellProps) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const shortcuts = [
		formatForDisplay("/"),
		"G D",
		"G P",
		"G M",
		"G S",
		formatForDisplay("Mod+Shift+N"),
	].join(" · ");

	return (
		<div className="min-h-svh bg-background text-foreground">
			<AdminHotkeys />
			<header className="sticky top-0 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
					<Link to="/admin" className="flex min-w-0 items-center gap-2">
						<div className="grid size-7 place-items-center border bg-primary text-primary-foreground">
							<span className="font-semibold text-xs">Z</span>
						</div>
						<div className="min-w-0">
							<p className="truncate font-medium text-sm">Zias admin</p>
							<p className="hidden text-muted-foreground text-xs sm:block">
								{shortcuts}
							</p>
						</div>
					</Link>
					<AdminActionLink to="/admin/posts/new" strong>
						<PlusIcon data-icon="inline-start" />
						New post
					</AdminActionLink>
				</div>
			</header>

			<div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
				<aside className="lg:sticky lg:top-20 lg:self-start">
					<nav className="flex gap-1 overflow-x-auto border-border border-b pb-3 lg:flex-col lg:overflow-visible lg:border-b-0 lg:pb-0">
						{adminNav.map((item) => {
							const Icon = item.icon;
							const active =
								item.to === "/admin"
									? pathname === "/admin" || pathname === "/admin/"
									: pathname.startsWith(item.to);

							return (
								<Link
									key={item.to}
									to={item.to as "/"}
									className={cn(
										"flex shrink-0 items-center gap-2 border px-3 py-2 text-sm transition-colors lg:justify-between",
										active
											? "border-foreground bg-foreground text-background"
											: "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
									)}
								>
									<span className="flex items-center gap-2">
										<Icon className="size-4" />
										{item.label}
									</span>
									<span className="hidden text-xs opacity-60 lg:inline">
										{item.shortcut}
									</span>
								</Link>
							);
						})}
					</nav>
				</aside>

				<main id="main-content" className="min-w-0">
					<div className="mb-6 flex flex-col gap-4 border-border border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
						<div className="min-w-0">
							{backTo && backLabel ? (
								<Link
									to={backTo as "/"}
									className="mb-2 inline-flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
								>
									<span aria-hidden>←</span>
									{backLabel}
								</Link>
							) : null}
							<h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
								{title}
							</h1>
							{description ? (
								<p className="mt-1 max-w-2xl text-muted-foreground text-sm">
									{description}
								</p>
							) : null}
						</div>
						{actions ? (
							<div className="flex flex-wrap items-center gap-2">{actions}</div>
						) : null}
					</div>
					{children}
				</main>
			</div>
		</div>
	);
}

function AdminHotkeys() {
	const navigate = useNavigate();

	useHotkey(
		"/",
		(event) => {
			event.preventDefault();
			const input = document.querySelector<HTMLInputElement>(
				"[data-admin-search]",
			);
			if (input) {
				input.focus();
				input.select();
			}
		},
		{
			ignoreInputs: true,
			meta: {
				name: "Focus admin search",
				description: "Focuses current page search field",
			},
		},
	);

	useHotkeySequence(["G", "D"], () => navigate({ to: "/admin" }), {
		meta: { name: "Go dashboard", description: "Go to admin dashboard" },
	});
	useHotkeySequence(["G", "P"], () => navigate({ to: "/admin/posts" }), {
		meta: { name: "Go posts", description: "Go to posts" },
	});
	useHotkeySequence(["G", "M"], () => navigate({ to: "/admin/messages" }), {
		meta: { name: "Go messages", description: "Go to messages" },
	});
	useHotkeySequence(["G", "S"], () => navigate({ to: "/admin/seo" }), {
		meta: { name: "Go SEO previews", description: "Go to OG image previews" },
	});
	useHotkey("Mod+Shift+N", () => navigate({ to: "/admin/posts/new" }), {
		meta: { name: "New post", description: "Create a new post" },
	});

	return null;
}

export function AdminActionLink({
	to,
	children,
	strong,
}: {
	to: string;
	children: ReactNode;
	strong?: boolean;
}) {
	return (
		<Link
			to={to as "/"}
			className={cn(
				buttonVariants({ variant: strong ? "default" : "outline", size: "sm" }),
				"w-fit",
			)}
		>
			{children}
		</Link>
	);
}

export function AdminPill({
	children,
	variant = "default",
}: {
	children: ReactNode;
	variant?: "default" | "success" | "warn" | "destructive";
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center border px-1.5 py-0.5 font-medium text-[11px] leading-none",
				variant === "success" &&
					"border-foreground/15 bg-muted text-foreground",
				variant === "warn" && "border-primary/20 bg-primary/10 text-foreground",
				variant === "destructive" &&
					"border-destructive/20 bg-destructive/10 text-destructive",
				variant === "default" &&
					"border-border bg-background text-muted-foreground",
			)}
		>
			{children}
		</span>
	);
}
