import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@zias/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@zias/ui/components/card";
import { Input } from "@zias/ui/components/input";
import { Label } from "@zias/ui/components/label";
import { toast } from "sonner";
import { z } from "zod";
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
		<main className="grid min-h-svh place-items-center bg-background px-4 py-10 text-foreground">
			<div className="w-full max-w-sm">
				<div className="mb-4 flex items-center gap-2">
					<div className="grid size-7 place-items-center border bg-primary text-primary-foreground">
						<span className="font-semibold text-xs">Z</span>
					</div>
					<div>
						<p className="font-medium text-sm">Zias admin</p>
						<p className="text-muted-foreground text-xs">
							Restricted workspace
						</p>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Sign in</CardTitle>
						<CardDescription>
							Use your admin account to manage content.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
							className="flex flex-col gap-4"
						>
							<form.Field name="email">
								{(f) => (
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="admin-email">Email</Label>
										<Input
											id="admin-email"
											type="email"
											value={f.state.value}
											onChange={(e) => f.handleChange(e.target.value)}
											onBlur={f.handleBlur}
											aria-invalid={Boolean(f.state.meta.errors[0])}
											autoComplete="email"
										/>
										{f.state.meta.errors[0] ? (
											<p className="text-destructive text-xs">
												{String(f.state.meta.errors[0])}
											</p>
										) : null}
									</div>
								)}
							</form.Field>
							<form.Field name="password">
								{(f) => (
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="admin-password">Password</Label>
										<Input
											id="admin-password"
											type="password"
											value={f.state.value}
											onChange={(e) => f.handleChange(e.target.value)}
											onBlur={f.handleBlur}
											aria-invalid={Boolean(f.state.meta.errors[0])}
											autoComplete="current-password"
										/>
										{f.state.meta.errors[0] ? (
											<p className="text-destructive text-xs">
												{String(f.state.meta.errors[0])}
											</p>
										) : null}
									</div>
								)}
							</form.Field>
							<form.Subscribe selector={(s) => s.isSubmitting}>
								{(isSubmitting) => (
									<Button
										type="submit"
										disabled={isSubmitting}
										className="mt-1 w-full"
									>
										{isSubmitting ? "Signing in..." : "Sign in"}
									</Button>
								)}
							</form.Subscribe>
						</form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
