import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Section, SectionInner } from "@zias/ui/components/section";
import { authClient } from "@/lib/auth-client";
import { Nav } from "@/components/nav";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) {
			throw redirect({ to: "/admin/login" });
		}
		return { session: session.data };
	},
});

function AdminDashboard() {
	const { data: posts } = useQuery(trpc.journal.adminList.queryOptions());
	const { data: contacts } = useQuery(trpc.contact.list.queryOptions());

	const unread = contacts?.filter((c) => !c.isRead).length ?? 0;
	const drafts = posts?.filter((p) => p.isDraft).length ?? 0;
	const published = posts?.filter((p) => !p.isDraft).length ?? 0;

	return (
		<>
			<Nav />
			<Section variant="hero" className="min-h-svh pt-[72px]">
				<SectionInner className="py-24">
					<div className="mb-10 flex items-center justify-between">
						<h1 className="font-display font-extrabold text-hero leading-tight">
							Admin
						</h1>
						<button
							type="button"
							onClick={() => authClient.signOut()}
							className="rounded-full border border-white/20 px-4 py-1.5 text-section-hero-fg/70 text-sm transition-colors hover:border-white/40 hover:text-section-hero-fg"
						>
							Sign out
						</button>
					</div>

					{/* Stats */}
					<div className="mb-10 grid grid-cols-3 gap-4">
						<StatCard label="Published" value={published} />
						<StatCard label="Drafts" value={drafts} />
						<StatCard
							label="Unread messages"
							value={unread}
							highlight={unread > 0}
						/>
					</div>

					{/* Quick links */}
					<div className="flex flex-wrap gap-3">
						<AdminLink to="/admin/posts">All posts →</AdminLink>
						<AdminLink to="/admin/posts/new">New post →</AdminLink>
						<AdminLink to="/admin/messages">Messages →</AdminLink>
					</div>
				</SectionInner>
			</Section>
		</>
	);
}

function StatCard({
	label,
	value,
	highlight,
}: {
	label: string;
	value: number;
	highlight?: boolean;
}) {
	return (
		<div
			className={`rounded-2xl border p-5 ${
				highlight
					? "border-white/30 bg-white/10"
					: "border-white/10 bg-white/5"
			}`}
		>
			<p className="text-section-hero-subtext text-label uppercase tracking-widest">
				{label}
			</p>
			<p className="mt-2 font-display font-extrabold text-4xl text-section-hero-fg">
				{value}
			</p>
		</div>
	);
}

function AdminLink({
	to,
	children,
}: {
	to: string;
	children: React.ReactNode;
}) {
	return (
		<Link
			to={to as "/"}
			className="rounded-full border border-white/20 bg-white/10 px-5 py-2 font-semibold text-section-hero-fg text-sm transition-colors hover:bg-white/20"
		>
			{children}
		</Link>
	);
}
