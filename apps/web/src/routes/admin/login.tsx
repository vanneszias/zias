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
			<Section id="main-content" variant="hero" className="min-h-svh pt-[72px]">
				<SectionInner className="grid min-h-[calc(100svh-72px)] place-items-center py-8 sm:py-12">
					<div className="w-full max-w-md rounded-3xl border border-white/20 bg-black/20 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8">
						<p className="mb-2 font-medium text-section-hero-subtext text-xs uppercase tracking-[0.18em]">
							Admin control center
						</p>
						<h1 className="mb-2 font-display font-extrabold text-4xl text-section-hero-fg sm:text-5xl">
							Sign in
						</h1>
						<p className="mb-8 text-section-hero-subtext text-sm sm:text-base">
							Sign in to manage your content.
						</p>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
							className="space-y-5"
						>
							<form.Field name="email">
								{(f) => (
									<label className="flex flex-col gap-1.5">
										<span className="font-medium text-label text-section-hero-fg/70 text-xs uppercase tracking-[0.16em]">
											Email
										</span>
										<input
											id="admin-email"
											type="email"
											value={f.state.value}
											onChange={(e) => f.handleChange(e.target.value)}
											onBlur={f.handleBlur}
											aria-invalid={Boolean(f.state.meta.errors[0])}
											className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-section-hero-fg text-sm placeholder:text-section-hero-fg/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
										/>
										{f.state.meta.errors[0] ? (
											<span className="text-white/75 text-xs">
												{String(f.state.meta.errors[0])}
											</span>
										) : null}
									</label>
								)}
							</form.Field>
							<form.Field name="password">
								{(f) => (
									<label className="flex flex-col gap-1.5">
										<span className="font-medium text-label text-section-hero-fg/70 text-xs uppercase tracking-[0.16em]">
											Password
										</span>
										<input
											id="admin-password"
											type="password"
											value={f.state.value}
											onChange={(e) => f.handleChange(e.target.value)}
											onBlur={f.handleBlur}
											aria-invalid={Boolean(f.state.meta.errors[0])}
											className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-section-hero-fg text-sm placeholder:text-section-hero-fg/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
										/>
										{f.state.meta.errors[0] ? (
											<span className="text-white/75 text-xs">
												{String(f.state.meta.errors[0])}
											</span>
										) : null}
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
