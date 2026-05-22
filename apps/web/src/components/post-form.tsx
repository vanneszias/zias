// biome-ignore-all lint/suspicious/noExplicitAny: TanStack Form render props require any; real typing needs all 10 generics
import type { PostCategory } from "@zias/content";
import { CATEGORY_LABELS, generateSlug, POST_CATEGORIES } from "@zias/content";
import { TiptapEditor } from "./tiptap-editor";

export type PostFormValues = {
	title: string;
	category: PostCategory;
	excerpt: string;
	slug: string;
	isCustomPage: boolean;
	isDraft: boolean;
	content: string | null;
};

/** Shared create/edit form for admin journal posts. */
export function PostForm({ form }: { form: any }) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			{/* Title */}
			<form.Field name="title">
				{(f: any) => (
					<label className="flex flex-col gap-1.5">
						<span className="font-semibold text-sm">Title</span>
						<input
							type="text"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							placeholder="Post title"
							className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
						/>
						{f.state.meta.errors[0] && (
							<span className="text-destructive text-xs">
								{String(f.state.meta.errors[0])}
							</span>
						)}
					</label>
				)}
			</form.Field>

			{/* Category + Status + Type */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
				<form.Field name="category">
					{(f: any) => (
						<label className="flex flex-col gap-1.5">
							<span className="font-semibold text-sm">Category</span>
							<select
								value={f.state.value}
								onChange={(e) => f.handleChange(e.target.value as PostCategory)}
								className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
							>
								{POST_CATEGORIES.map((cat) => (
									<option key={cat} value={cat}>
										{CATEGORY_LABELS[cat]}
									</option>
								))}
							</select>
						</label>
					)}
				</form.Field>

				<form.Field name="isDraft">
					{(f: any) => (
						<label className="flex flex-col gap-1.5">
							<span className="font-semibold text-sm">Status</span>
							<select
								value={f.state.value ? "draft" : "published"}
								onChange={(e) => f.handleChange(e.target.value === "draft")}
								className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
							>
								<option value="draft">Draft</option>
								<option value="published">Published</option>
							</select>
						</label>
					)}
				</form.Field>

				<form.Field name="isCustomPage">
					{(f: any) => (
						<label className="flex flex-col gap-1.5">
							<span className="font-semibold text-sm">Type</span>
							<select
								value={f.state.value ? "custom" : "tiptap"}
								onChange={(e) => f.handleChange(e.target.value === "custom")}
								className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
							>
								<option value="tiptap">Rich text (Tiptap)</option>
								<option value="custom">Custom React page</option>
							</select>
						</label>
					)}
				</form.Field>
			</div>

			{/* Slug */}
			<form.Field name="slug">
				{(f: any) => (
					<label className="flex flex-col gap-1.5">
						<span className="font-semibold text-sm">
							Slug{" "}
							<span className="font-normal text-muted-foreground">
								(auto-generated if empty)
							</span>
						</span>
						<input
							type="text"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							placeholder="my-post-slug"
							className="rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
						/>
					</label>
				)}
			</form.Field>

			{/* Excerpt */}
			<form.Field name="excerpt">
				{(f: any) => (
					<label className="flex flex-col gap-1.5">
						<span className="font-semibold text-sm">Excerpt</span>
						<textarea
							rows={2}
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							placeholder="Short description shown in post cards"
							className="resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
						/>
					</label>
				)}
			</form.Field>

			{/* Content — only for rich-text posts */}
			<form.Subscribe selector={(s: any) => s.values.isCustomPage}>
				{(isCustomPage: any) =>
					!isCustomPage && (
						<form.Field name="content">
							{(f: any) => (
								<div className="flex flex-col gap-1.5">
									<span className="font-semibold text-sm">Content</span>
									<TiptapEditor
										value={f.state.value ?? undefined}
										onChange={(json) => f.handleChange(json)}
									/>
								</div>
							)}
						</form.Field>
					)
				}
			</form.Subscribe>

			{/* Custom page hint */}
			<form.Subscribe selector={(s: any) => s.values.isCustomPage}>
				{(isCustomPage: any) =>
					isCustomPage && (
						<form.Subscribe
							selector={(s: any) => s.values.slug || s.values.title}
						>
							{(slugOrTitle: any) => {
								const slug = generateSlug(slugOrTitle);
								return (
									<div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-900 dark:bg-blue-950/30">
										<p className="font-semibold text-blue-800 dark:text-blue-300">
											Custom React page
										</p>
										<p className="mt-1 text-blue-700 dark:text-blue-400">
											Create the file at:
										</p>
										<code className="mt-1 block rounded bg-blue-100 px-2 py-1 font-mono text-xs dark:bg-blue-900">
											apps/web/src/content/journal/{slug || "your-slug"}.tsx
										</code>
										<p className="mt-2 text-blue-700 dark:text-blue-400">
											Export a default React component. It gets full control
											over layout.
										</p>
									</div>
								);
							}}
						</form.Subscribe>
					)
				}
			</form.Subscribe>

			{/* Submit */}
			<div className="flex justify-end">
				<form.Subscribe
					selector={(s: any) => ({
						isSubmitting: s.isSubmitting,
						canSubmit: s.canSubmit,
					})}
				>
					{({ isSubmitting, canSubmit }: any) => (
						<button
							type="submit"
							disabled={!canSubmit || isSubmitting}
							className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
						>
							{isSubmitting ? "Saving…" : "Save post"}
						</button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}
