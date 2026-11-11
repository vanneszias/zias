export type Post = {
  title: string;
  categoryLabel: string | null;
  updatedAt: string | null;
};

type Row = {
  title: string | null;
  updated_at: string | null;
  category_label: string | null;
};

// EmDash stores each collection in `ec_<collection>` with system columns
// (slug, status, deleted_at, locale, translation_group, updated_at) plus one
// column per field. Taxonomy assignments live in `content_taxonomies`, keyed by
// the entry's translation group and the term's translation group.
const SQL = `
SELECT p.title, p.updated_at, t.label AS category_label
FROM ec_posts p
LEFT JOIN content_taxonomies ct
  ON ct.collection = 'posts' AND ct.entry_id = COALESCE(p.translation_group, p.id)
LEFT JOIN taxonomies t
  ON t.translation_group = ct.taxonomy_id
  AND t.slug IN ('words','essay','note','work','case-study','project','misc')
WHERE p.slug = ?1 AND p.status = 'published' AND p.deleted_at IS NULL
ORDER BY (t.slug IS NULL), p.locale
LIMIT 1`;

export async function findPublishedPost(
  db: D1Database,
  slug: string,
): Promise<Post | null> {
  const row = await db.prepare(SQL).bind(slug).first<Row>();
  if (!row?.title) return null;
  return {
    title: row.title,
    categoryLabel: row.category_label,
    updatedAt: row.updated_at,
  };
}
