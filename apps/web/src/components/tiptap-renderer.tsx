import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapRendererProps {
  content: string;
  className?: string;
}

/**
 * Read-only Tiptap renderer for journal posts.
 * Parses Tiptap JSON and renders with prose-friendly styles.
 */
export function TiptapRenderer({ content, className }: TiptapRendererProps) {
  const editor = useEditor({
    extensions: [StarterKit, Link, Typography, Image],
    content: JSON.parse(content),
    editable: false,
    immediatelyRender: false,
  });

  return (
    <div className={className}>
      <EditorContent
        editor={editor}
        className="prose prose-lg prose-neutral dark:prose-invert max-w-none prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-headings:font-display prose-headings:font-extrabold prose-a:text-foreground prose-code:text-sm prose-a:underline prose-a:underline-offset-4"
      />
    </div>
  );
}
