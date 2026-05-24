"use client";

import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@zias/ui/lib/utils";

interface TiptapEditorProps {
	value?: string | null;
	onChange?: (json: string) => void;
	placeholder?: string;
	className?: string;
}

/** Rich text editor for journal posts (admin only). */
export function TiptapEditor({
	value,
	onChange,
	placeholder = "Write something...",
	className,
}: TiptapEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({ openOnClick: false }),
			Typography,
			Image,
			CharacterCount,
			Placeholder.configure({ placeholder }),
		],
		content: value ? JSON.parse(value) : undefined,
		onUpdate({ editor: e }) {
			onChange?.(JSON.stringify(e.getJSON()));
		},
	});

	return (
		<div className={cn("border border-border bg-background", className)}>
			{/* Toolbar */}
			{editor && (
				<div className="flex flex-wrap gap-1 border-border border-b bg-muted/40 p-2">
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleBold().run()}
						active={editor.isActive("bold")}
					>
						B
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleItalic().run()}
						active={editor.isActive("italic")}
					>
						<em>I</em>
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleStrike().run()}
						active={editor.isActive("strike")}
					>
						<s>S</s>
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleCode().run()}
						active={editor.isActive("code")}
					>
						{"<>"}
					</ToolbarButton>
					<div className="w-px bg-border" />
					{([1, 2, 3] as const).map((level) => (
						<ToolbarButton
							key={level}
							onClick={() =>
								editor.chain().focus().toggleHeading({ level }).run()
							}
							active={editor.isActive("heading", { level })}
						>
							H{level}
						</ToolbarButton>
					))}
					<div className="w-px bg-border" />
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						active={editor.isActive("bulletList")}
					>
						•—
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						active={editor.isActive("orderedList")}
					>
						1.
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
						active={editor.isActive("blockquote")}
					>
						"
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
						active={editor.isActive("codeBlock")}
					>
						{"{ }"}
					</ToolbarButton>
				</div>
			)}

			{/* Editor area */}
			<EditorContent
				editor={editor}
				className="prose prose-neutral dark:prose-invert max-w-none p-4 prose-headings:font-display prose-headings:font-extrabold focus-within:outline-none [&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
			/>

			{editor && (
				<p className="border-border border-t px-4 py-2 text-right text-muted-foreground text-xs">
					{editor.storage.characterCount.words()} words
				</p>
			)}
		</div>
	);
}

function ToolbarButton({
	onClick,
	active,
	children,
}: {
	onClick: () => void;
	active?: boolean;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"border border-transparent px-2 py-1 font-medium text-xs transition-colors",
				active
					? "bg-primary text-primary-foreground"
					: "text-muted-foreground hover:border-border hover:bg-background hover:text-foreground",
			)}
		>
			{children}
		</button>
	);
}
