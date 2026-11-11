import { type CacheHint, type ContentEntry, getEmDashCollection, getTaxonomyTerms, type TaxonomyTerm } from "emdash";

/** The post fields the site reads; the full type is generated in the site's `emdash-env.d.ts`. */
export interface PostData {
  id: string;
  title: string;
  excerpt?: string;
  read_time?: number;
  publishedAt: Date | null;
  updatedAt: Date;
  terms?: Record<string, TaxonomyTerm[]>;
}

export type Post = ContentEntry<PostData>;

const flatten = (terms: TaxonomyTerm[]): TaxonomyTerm[] => terms.flatMap((t) => [t, ...flatten(t.children ?? [])]);

/** Every category term, parents and children alike. */
export async function getCategories(): Promise<TaxonomyTerm[]> {
  return flatten(await getTaxonomyTerms("category", { includeCounts: false }));
}

/** A category and all its descendants, so filtering on `work` also finds case studies. */
function family(slug: string, terms: TaxonomyTerm[]): string[] {
  const term = terms.find((t) => t.slug === slug);
  if (!term) return [slug];
  return [slug, ...terms.filter((t) => t.parentId === term.id).flatMap((t) => family(t.slug, terms))];
}

/** Published posts, newest first, optionally limited to a category and its children. */
export async function getPosts(options: { limit?: number; category?: string; cursor?: string } = {}) {
  const { limit = 24, category, cursor } = options;
  const where = category ? { category: family(category, await getCategories()) } : undefined;
  const result = await getEmDashCollection("posts", { limit, cursor, where, orderBy: { published_at: "desc" } });
  return result as typeof result & { entries: Post[]; cacheHint: CacheHint };
}

/** The post's own category: the most specific term it carries. */
export function postCategory(post: Post): TaxonomyTerm | undefined {
  const terms = post.data.terms?.category ?? [];
  return terms.find((t) => !terms.some((other) => other.parentId === t.id)) ?? terms[0];
}

const DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** The meta line of a post: its date and read time, for a Tag. */
export function postMeta(post: Post): string {
  const { publishedAt, read_time } = post.data;
  return [publishedAt && DATE.format(publishedAt), read_time && `${read_time} min read`].filter(Boolean).join(" · ");
}
