import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { cn } from "@zias/ui/lib/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
	AdminActionLink,
	AdminPill,
	AdminShell,
} from "@/components/admin-shell";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/admin/messages")({
	component: AdminMessages,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) throw redirect({ to: "/admin/login" });
	},
});

function AdminMessages() {
	const qc = useQueryClient();
	const [query, setQuery] = useState("");
	const [mode, setMode] = useState<"all" | "unread">("all");
	const {
		data: messages,
		isLoading,
		isError,
		refetch,
	} = useQuery(trpc.contact.list.queryOptions());
	const { mutateAsync: markRead } = useMutation(
		trpc.contact.markRead.mutationOptions(),
	);

	async function handleMarkRead(id: string) {
		await markRead(id);
		qc.invalidateQueries({ queryKey: ["contact"] });
		toast.success("Marked as read");
	}

	const visibleMessages = useMemo(() => {
		return (messages ?? []).filter((msg) => {
			const matchesMode = mode === "all" ? true : !msg.isRead;
			const q = query.toLowerCase();
			const matchesQuery =
				q.length === 0 ||
				msg.name?.toLowerCase().includes(q) ||
				msg.email.toLowerCase().includes(q) ||
				msg.message.toLowerCase().includes(q);
			return matchesMode && matchesQuery;
		});
	}, [messages, mode, query]);

	async function handleMarkVisibleRead() {
		const unreadVisible = visibleMessages.filter((m) => !m.isRead);
		if (unreadVisible.length === 0) {
			toast.info("No unread messages in current view");
			return;
		}
		await Promise.all(unreadVisible.map((m) => markRead(m.id)));
		qc.invalidateQueries({ queryKey: ["contact"] });
		toast.success(`Marked ${unreadVisible.length} messages as read`);
	}

	return (
		<AdminShell
			title="Messages"
			description="Triage incoming contact requests quickly."
			backTo="/admin"
			backLabel="Admin"
			actions={
				<>
					<AdminActionLink to="/admin/posts/new">New post</AdminActionLink>
					<button
						type="button"
						onClick={handleMarkVisibleRead}
						className="rounded-full border border-white/25 bg-white/10 px-4 py-2 font-semibold text-section-hero-fg text-sm transition-colors hover:bg-white/20 focus-visible:outline-none"
					>
						Mark visible read
					</button>
				</>
			}
		>
			<div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					data-admin-search
					placeholder="Search sender, email, or message"
					className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-section-hero-fg text-sm placeholder:text-section-hero-fg/50 focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/30"
				/>
				<select
					value={mode}
					onChange={(e) => setMode(e.target.value as "all" | "unread")}
					className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-section-hero-fg text-sm focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/30"
				>
					<option value="all">All messages</option>
					<option value="unread">Unread only</option>
				</select>
			</div>

			<div className="mb-3 flex items-center justify-between text-section-hero-subtext text-sm">
				<p>{visibleMessages.length} results</p>
				{mode === "unread" ? (
					<AdminPill variant="warn">Unread view</AdminPill>
				) : null}
			</div>
			{isError ? (
				<div className="mb-4 rounded-2xl border border-red-300/35 bg-red-300/10 p-4">
					<p className="font-semibold text-red-100">Could not load messages.</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="mt-2 rounded-full border border-red-200/40 px-3 py-1.5 text-red-100 text-xs transition-colors hover:bg-red-300/15 focus-visible:outline-none"
					>
						Retry
					</button>
				</div>
			) : null}

			{isLoading && (
				<div className="space-y-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
					))}
				</div>
			)}

			<div className="space-y-3">
				{visibleMessages.map((msg) => (
					<div
						key={msg.id}
						className={cn(
							"rounded-2xl border p-4 transition-colors sm:p-5",
							msg.isRead
								? "border-white/10 bg-white/5"
								: "border-amber-300/35 bg-amber-200/10",
						)}
					>
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<p className="font-semibold">{msg.name || "Anonymous"}</p>
									<a
										href={`mailto:${msg.email}`}
										className="truncate text-muted-foreground text-sm hover:text-foreground"
									>
										{msg.email}
									</a>
									{!msg.isRead ? (
										<AdminPill variant="warn">New</AdminPill>
									) : (
										<AdminPill>Read</AdminPill>
									)}
								</div>
								<p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
									{msg.message}
								</p>
								<p className="mt-2 text-muted-foreground text-xs">
									{new Date(msg.createdAt).toLocaleDateString("en-GB", {
										day: "numeric",
										month: "short",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
							</div>
							{!msg.isRead && (
								<button
									type="button"
									onClick={() => handleMarkRead(msg.id)}
									className="shrink-0 rounded-full border border-white/20 px-3 py-1.5 text-section-hero-fg text-xs transition-colors hover:bg-white/10 focus-visible:outline-none"
								>
									Mark read
								</button>
							)}
						</div>
					</div>
				))}
				{visibleMessages.length === 0 && (
					<div className="py-12 text-center">
						<p className="font-semibold text-foreground">No messages found.</p>
						<p className="mt-1 text-muted-foreground text-sm">
							Try another filter or search query.
						</p>
					</div>
				)}
			</div>
		</AdminShell>
	);
}
