import type { PostCategory } from "./categories";

export interface PostMeta {
  id: string;
  slug: string;
  title: string;
  category: PostCategory;
  excerpt: string;
  readTime: number;
  /** tRPC serializes Date → string over the wire; accept both */
  publishedAt: Date | string | null;
  isCustomPage: boolean;
  isDraft: boolean;
}

export interface Post extends PostMeta {
  /** Tiptap JSON content string (null for custom React pages) */
  content: string | null;
}
