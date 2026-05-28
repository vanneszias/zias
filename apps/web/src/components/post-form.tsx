// biome-ignore-all lint/suspicious/noExplicitAny: TanStack Form render props require any; real typing needs all 10 generics
import type { PostCategory } from "@zias/content";
import { CATEGORY_LABELS, generateSlug, POST_CATEGORIES } from "@zias/content";
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
import { TiptapEditor } from "./tiptap-editor";

export type PostFormValues = {
	title: string;
	category: PostCategory;
	excerpt: string;
	slug: string;
	isCustomPage: boolean;
	isDraft: boolean;
	content: string | null;
	publishedAt: string | null;
};

/** Shared create/edit form for admin journal posts. */
export function PostForm({ form }: { form: any }) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="flex flex-col gap-4"
		>
			<Card>
				<CardHeader>
					<CardTitle>Post details</CardTitle>
					<CardDescription>
						Title, routing, and publishing metadata.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<form.Field name="title">
						{(f: any) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="post-title">Title</Label>
								<Input
									id="post-title"
									type="text"
									value={f.state.value}
									onChange={(e) => f.handleChange(e.target.value)}
									placeholder="Post title"
									aria-invalid={Boolean(f.state.meta.errors[0])}
								/>
								{f.state.meta.errors[0] ? (
									<p className="text-destructive text-xs">
										{String(f.state.meta.errors[0])}
									</p>
								) : null}
							</div>
						)}
					</form.Field>

					<div className="grid gap-4 md:grid-cols-4">
						<form.Field name="category">
							{(f: any) => (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor="post-category">Category</Label>
									<select
										id="post-category"
										value={f.state.value}
										onChange={(e) =>
											f.handleChange(e.target.value as PostCategory)
										}
										className="h-8 border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
									>
										{POST_CATEGORIES.map((cat) => (
											<option key={cat} value={cat}>
												{CATEGORY_LABELS[cat]}
											</option>
										))}
									</select>
								</div>
							)}
						</form.Field>

						<form.Field name="isDraft">
							{(f: any) => (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor="post-status">Status</Label>
									<select
										id="post-status"
										value={f.state.value ? "draft" : "published"}
										onChange={(e) => f.handleChange(e.target.value === "draft")}
										className="h-8 border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
									>
										<option value="draft">Draft</option>
										<option value="published">Published</option>
									</select>
								</div>
							)}
						</form.Field>

						<form.Field name="publishedAt">
							{(f: any) => (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor="post-published-at">Published date</Label>
									<Input
										id="post-published-at"
										type="date"
										value={f.state.value ?? ""}
										onChange={(e) => f.handleChange(e.target.value || null)}
									/>
								</div>
							)}
						</form.Field>

						<form.Field name="isCustomPage">
							{(f: any) => (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor="post-type">Type</Label>
									<select
										id="post-type"
										value={f.state.value ? "custom" : "tiptap"}
										onChange={(e) =>
											f.handleChange(e.target.value === "custom")
										}
										className="h-8 border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
									>
										<option value="tiptap">Rich text</option>
										<option value="custom">Custom page</option>
									</select>
								</div>
							)}
						</form.Field>
					</div>

					<form.Field name="slug">
						{(f: any) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="post-slug">Slug</Label>
								<Input
									id="post-slug"
									type="text"
									value={f.state.value}
									onChange={(e) => f.handleChange(e.target.value)}
									placeholder="generated-from-title-if-empty"
									className="font-mono"
								/>
								<p className="text-muted-foreground text-xs">
									Leave empty to generate from the title.
								</p>
							</div>
						)}
					</form.Field>

					<form.Field name="excerpt">
						{(f: any) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="post-excerpt">Excerpt</Label>
								<textarea
									id="post-excerpt"
									rows={3}
									value={f.state.value}
									onChange={(e) => f.handleChange(e.target.value)}
									placeholder="Short description shown in post cards"
									className="min-h-20 resize-y border border-input bg-background px-2.5 py-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
								/>
							</div>
						)}
					</form.Field>
				</CardContent>
			</Card>

			<form.Subscribe selector={(s: any) => s.values.isCustomPage}>
				{(isCustomPage: any) =>
					isCustomPage ? (
						<CustomPageHint form={form} />
					) : (
						<ContentEditor form={form} />
					)
				}
			</form.Subscribe>

			<div className="sticky bottom-4 flex justify-end border bg-background p-3 shadow-background/50 shadow-lg">
				<form.Subscribe
					selector={(s: any) => ({
						isSubmitting: s.isSubmitting,
						canSubmit: s.canSubmit,
					})}
				>
					{({ isSubmitting, canSubmit }: any) => (
						<Button type="submit" disabled={!canSubmit || isSubmitting}>
							{isSubmitting ? "Saving..." : "Save post"}
						</Button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}

function ContentEditor({ form }: { form: any }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Content</CardTitle>
				<CardDescription>Write and format the post body.</CardDescription>
			</CardHeader>
			<CardContent>
				<form.Field name="content">
					{(f: any) => (
						<TiptapEditor
							value={f.state.value ?? undefined}
							onChange={(json) => f.handleChange(json)}
						/>
					)}
				</form.Field>
			</CardContent>
		</Card>
	);
}

function CustomPageHint({ form }: { form: any }) {
	return (
		<form.Subscribe selector={(s: any) => s.values.slug || s.values.title}>
			{(slugOrTitle: any) => {
				const slug = generateSlug(slugOrTitle);
				return (
					<Card>
						<CardHeader>
							<CardTitle>Custom React page</CardTitle>
							<CardDescription>
								This post is rendered from a checked-in React component.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm">Create this file:</p>
							<code className="mt-2 block border bg-muted px-3 py-2 font-mono text-xs">
								apps/web/src/content/journal/{slug || "your-slug"}.tsx
							</code>
							<p className="mt-3 text-muted-foreground text-sm">
								Export a default React component. It controls the full page
								layout.
							</p>
						</CardContent>
					</Card>
				);
			}}
		</form.Subscribe>
	);
}
