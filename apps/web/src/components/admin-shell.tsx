import {
	formatForDisplay,
	useHotkey,
	useHotkeySequence,
} from "@tanstack/react-hotkeys";
import { Link, useNavigate } from "@tanstack/react-router";
import { Section, SectionInner } from "@zias/ui/components/section";
import type { ReactNode } from "react";
import { Nav } from "@/components/nav";

type AdminShellProps = {
	title: string;
	description?: string;
	backTo?: string;
	backLabel?: string;
	actions?: ReactNode;
	children: ReactNode;
};

export function AdminShell({
	title,
	description,
	backTo,
	backLabel,
	actions,
	children,
}: AdminShellProps) {
	const shortcuts = [
		formatForDisplay("/"),
		"G D",
		"G P",
		"G M",
		"G S",
		formatForDisplay("Mod+Shift+N"),
	].join("  ");

	return (
		<>
			<Nav />
			<AdminHotkeys />
			<Section id="main-content" variant="hero" className="min-h-svh pt-[72px]">
				<SectionInner className="pt-6 pb-12 sm:pt-8 lg:pt-10">
					<div className="rounded-3xl border border-white/10 bg-black/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6 lg:p-8">
						<div className="flex flex-col gap-6 border-white/10 border-b pb-5 sm:pb-6">
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div>
									{backTo && backLabel ? (
										<Link
											to={backTo as "/"}
											className="inline-flex items-center gap-1 text-section-hero-subtext text-sm transition-colors hover:text-section-hero-fg"
										>
											<span aria-hidden>←</span>
											{backLabel}
										</Link>
									) : null}
									<h1 className="mt-2 font-display font-extrabold text-3xl text-section-hero-fg sm:text-4xl">
										{title}
									</h1>
									{description ? (
										<p className="mt-1 max-w-2xl text-section-hero-subtext text-sm sm:text-base">
											{description}
										</p>
									) : null}
								</div>
								{actions ? (
									<div className="flex w-full flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end">
										{actions}
									</div>
								) : null}
							</div>
						</div>
						<div className="pt-5 sm:pt-6">{children}</div>
						<p className="mt-5 text-section-hero-subtext/80 text-xs">
							Shortcuts: {shortcuts}
						</p>
					</div>
				</SectionInner>
			</Section>
		</>
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
			className={`inline-flex items-center justify-center rounded-full px-4 py-2 font-semibold text-sm transition-colors focus-visible:outline-none ${
				strong
					? "bg-white text-section-hero hover:bg-white/90"
					: "border border-white/25 bg-white/10 text-section-hero-fg hover:bg-white/20"
			}`}
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
	variant?: "default" | "success" | "warn";
}) {
	const classes =
		variant === "success"
			? "border-emerald-300/40 bg-emerald-300/15 text-emerald-100"
			: variant === "warn"
				? "border-amber-300/50 bg-amber-300/15 text-amber-100"
				: "border-white/20 bg-white/10 text-section-hero-fg/90";

	return (
		<span
			className={`inline-flex items-center rounded-full border px-2.5 py-1 font-semibold text-[11px] uppercase tracking-wide ${classes}`}
		>
			{children}
		</span>
	);
}
