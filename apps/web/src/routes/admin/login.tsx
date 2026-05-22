import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Section, SectionInner } from "@zias/ui/components/section";
import { toast } from "sonner";
import { z } from "zod";
import { Nav } from "@/components/nav";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin/login")({
	component: AdminLogin,
});

function AdminLogin() {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email"),
				password: z.string().min(8),
			}),
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(value, {
				onSuccess: () => {
					navigate({ to: "/admin" });
				},
				onError: (err) => {
					toast.error(err.error.message || "Sign in failed");
				},
			});
		},
	});

	return (
		<>
			<Nav />
			<Section variant="hero" className="min-h-svh pt-[72px]">
				<SectionInner className="flex items-center py-24">
					<div className="w-full max-w-sm">
						<h1 className="mb-2 font-display font-extrabold text-4xl">
							Admin
						</h1>
						<p className="mb-8 text-section-hero-subtext text-subtext">
							Sign in to manage your content.
						</p>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
							className="space-y-4"
						>
							<form.Field name="email">
								{(f) => (
									<label className="flex flex-col gap-1.5">
										<span className="font-medium text-section-hero-fg/70 text-sm uppercase tracking-widest text-label">
											Email
										</span>
										<input
											type="email"
											value={f.state.value}
											onChange={(e) => f.handleChange(e.target.value)}
											className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-section-hero-fg placeholder:text-section-hero-fg/40 focus:outline-none focus:ring-2 focus:ring-white/40"
										/>
									</label>
								)}
							</form.Field>
							<form.Field name="password">
								{(f) => (
									<label className="flex flex-col gap-1.5">
										<span className="font-medium text-section-hero-fg/70 text-label text-sm uppercase tracking-widest">
											Password
										</span>
										<input
											type="password"
											value={f.state.value}
											onChange={(e) => f.handleChange(e.target.value)}
											className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-section-hero-fg placeholder:text-section-hero-fg/40 focus:outline-none focus:ring-2 focus:ring-white/40"
										/>
									</label>
								)}
							</form.Field>
							<form.Subscribe selector={(s) => s.isSubmitting}>
								{(isSubmitting) => (
									<button
										type="submit"
										disabled={isSubmitting}
										className="mt-2 w-full rounded-full bg-white px-4 py-2.5 font-bold font-display text-section-hero text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
									>
										{isSubmitting ? "Signing in…" : "Sign in →"}
									</button>
								)}
							</form.Subscribe>
						</form>
					</div>
				</SectionInner>
			</Section>
		</>
	);
}
