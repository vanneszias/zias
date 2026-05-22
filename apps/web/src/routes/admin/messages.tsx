import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Section, SectionInner } from "@zias/ui/components/section";
import { cn } from "@zias/ui/lib/utils";
import { toast } from "sonner";
import { Nav } from "@/components/nav";
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
	const { data: messages, isLoading } = useQuery(
		trpc.contact.list.queryOptions(),
	);
	const { mutateAsync: markRead } = useMutation(
		trpc.contact.markRead.mutationOptions(),
	);

	async function handleMarkRead(id: string) {
		await markRead(id);
		qc.invalidateQueries({ queryKey: ["contact"] });
		toast.success("Marked as read");
	}

	return (
		<>
			<Nav />
			{/* Hero header */}
			<Section variant="hero" className="pt-[72px]">
				<SectionInner className="py-10">
					<div className="flex items-center gap-4">
						<Link
							to="/admin"
							className="text-section-hero-subtext text-sm transition-colors hover:text-section-hero-fg"
						>
							← Admin
						</Link>
						<h1 className="font-display font-extrabold text-3xl">Messages</h1>
					</div>
				</SectionInner>
			</Section>
			{/* Messages list on plain background */}
			<Section variant="plain">
				<SectionInner className="py-10">
					<div className="mx-auto max-w-3xl">
						{isLoading && (
							<div className="space-y-3">
								{Array.from({ length: 3 }).map((_, i) => (
									<div
										key={i}
										className="h-24 animate-pulse rounded-xl bg-muted"
									/>
								))}
							</div>
						)}

						<div className="space-y-3">
							{messages?.map((msg) => (
								<div
									key={msg.id}
									className={cn(
										"rounded-2xl border p-5 transition-colors",
										msg.isRead
											? "border-border bg-card opacity-60"
											: "border-primary/30 bg-primary/5",
									)}
								>
									<div className="flex items-start justify-between gap-4">
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<p className="font-semibold">
													{msg.name || "Anonymous"}
												</p>
												<a
													href={`mailto:${msg.email}`}
													className="truncate text-muted-foreground text-sm hover:text-foreground"
												>
													{msg.email}
												</a>
												{!msg.isRead && (
													<span className="rounded-full bg-primary px-2 py-0.5 font-semibold text-primary-foreground text-xs">
														New
													</span>
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
												className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:bg-muted"
											>
												Mark read
											</button>
										)}
									</div>
								</div>
							))}
							{messages?.length === 0 && (
								<p className="py-12 text-center text-muted-foreground">
									No messages yet.
								</p>
							)}
						</div>
					</div>
				</SectionInner>
			</Section>
		</>
	);
}
