import { Database } from "bun:sqlite";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";

config({ path: `${import.meta.dir}/../../../apps/server/.env.local` });

const d1Dir = join(
  import.meta.dir,
  "../../../.alchemy/miniflare/v3/d1/miniflare-D1DatabaseObject",
);

const sqliteFiles = readdirSync(d1Dir).filter((f) => f.endsWith(".sqlite"));

if (sqliteFiles.length === 0) {
  console.error(`No local D1 SQLite file found in ${d1Dir}`);
  console.error("Make sure the dev server has been started at least once.");
  process.exit(1);
}

const dbPath = join(d1Dir, sqliteFiles[0]);
console.log(`Using local D1: ${dbPath}`);

const db = new Database(dbPath);

const author = db
  .query<{ id: string }, []>("SELECT id FROM user LIMIT 1")
  .get();

if (!author) {
  console.error("No user found — run db:create-admin:local first.");
  process.exit(1);
}

const authorId = author.id;
const now = Date.now();

function doc(...paragraphs: string[]) {
  return JSON.stringify({
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  });
}

const posts = [
  {
    id: crypto.randomUUID(),
    slug: "on-designing-with-constraints",
    title: "On designing with constraints",
    category: "words:essay",
    excerpt:
      "Constraints aren't obstacles — they're the invisible scaffolding that keeps creative decisions from collapsing into infinite possibility.",
    content: doc(
      "Constraints aren't obstacles — they're the invisible scaffolding that keeps creative decisions from collapsing into infinite possibility.",
      "Every project I've worked on that felt truly alive had one thing in common: a hard limit that forced invention. A tight deadline. A single typeface. A palette of two colors. The constraint didn't restrict the work — it focused it.",
      "When everything is possible, nothing is interesting. When you can only pick three things, you have to care deeply about which three. That care shows up in the final piece.",
      "The best briefs I've received weren't the open-ended ones. They were the ones that said: here's exactly what we need, here's exactly what we can't change, now make something remarkable within that.",
      "I've started treating self-imposed constraints the same way. No gradients this month. Only system fonts. Maximum two breakpoints. The work that comes out is stranger, sharper, more itself.",
    ),
    readTime: 3,
    isCustomPage: 0,
    isDraft: 0,
    publishedAt: now - 12 * 24 * 60 * 60 * 1000,
  },
  {
    id: crypto.randomUUID(),
    slug: "quick-note-on-view-transitions",
    title: "Quick note on View Transitions",
    category: "words:note",
    excerpt:
      "The View Transitions API finally landed broadly and it's better than I expected.",
    content: doc(
      "The View Transitions API finally landed broadly and it's better than I expected.",
      "The basic cross-document fade is free. You opt in with one line of CSS and suddenly page navigations feel native. That alone is worth it.",
      "The named element transitions are where it gets interesting. You can persist a card across routes with view-transition-name and the browser does the FLIP interpolation automatically. I've been abusing this for hero images.",
      "The one footgun: don't forget to scope names per-item when rendering lists, otherwise the browser picks one arbitrarily and the animation looks broken.",
    ),
    readTime: 2,
    isCustomPage: 0,
    isDraft: 0,
    publishedAt: now - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: crypto.randomUUID(),
    slug: "rebuilding-zias-be",
    title: "Rebuilding zias.be",
    category: "work:project",
    excerpt:
      "A full rewrite of my personal site — B&W serif base, vivid color-block sections, dark mode, and a self-hosted CMS.",
    content: doc(
      "A full rewrite of my personal site — B&W serif base, vivid color-block sections, dark mode, and a self-hosted CMS.",
      "The previous version was a single-page Framer export. It looked fine but I had zero control over the content. Every edit meant opening Framer, tweaking, re-exporting, re-deploying. Not sustainable.",
      "The new stack is TanStack Start on Cloudflare Pages, tRPC for the API layer, D1 as the database, and Tiptap for rich text editing. The whole thing deploys with a single bun run deploy.",
      "Design-wise I wanted something that felt more like editorial print than a typical dev portfolio. Big serif headlines, tight leading, white space used intentionally rather than as a default. Then vivid color-block sections to break the monotony and give each area its own identity.",
      "The CMS is minimal by design — just what I need. Post management, draft/published toggle, a contact inbox. Nothing I don't use daily.",
    ),
    readTime: 4,
    isCustomPage: 0,
    isDraft: 0,
    publishedAt: now - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: crypto.randomUUID(),
    slug: "accessibility-audit-e-commerce",
    title: "Accessibility audit for a Belgian e-commerce platform",
    category: "work:case-study",
    excerpt:
      "A systematic WCAG 2.2 audit that surfaced 47 issues across checkout and product listing — and a phased remediation plan.",
    content: doc(
      "A systematic WCAG 2.2 audit that surfaced 47 issues across checkout and product listing — and a phased remediation plan.",
      "The client had never done a formal accessibility audit. They knew something was off — screen reader users had complained — but had no framework for prioritising fixes.",
      "I started with automated scanning (axe-core, Lighthouse) to get the low-hanging fruit: missing alt text, broken form labels, insufficient color contrast. That covered about 30% of the issues.",
      "The rest required manual testing with NVDA on Windows and VoiceOver on macOS. The checkout flow was particularly broken — focus management was completely absent after modal dialogs, and error messages weren't associated with their fields.",
      "The remediation plan was split into three phases: critical blockers (anything that prevented task completion), impactful friction (things that were painful but not blocking), and polish (nice-to-haves). The team shipped Phase 1 within two weeks.",
    ),
    readTime: 5,
    isCustomPage: 0,
    isDraft: 0,
    publishedAt: now - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: crypto.randomUUID(),
    slug: "currently-reading-q2",
    title: "Currently reading — Q2",
    category: "misc",
    excerpt: "A few books I've been working through between projects.",
    content: doc(
      "A few books I've been working through between projects.",
      "Thinking in Systems by Donella Meadows — should be mandatory reading for anyone who ships software. Everything is a system. Everything has feedback loops. Most problems are structural, not personal.",
      "The Elements of Typographic Style by Robert Bringhurst — I keep coming back to this one. Chapter 5 on rhythm and proportion is the best writing I've read on why type feels right or wrong.",
      "Mort by Terry Pratchett — not everything needs to be productive. Sometimes you just need Death to be charming and funny for 300 pages.",
    ),
    readTime: 2,
    isCustomPage: 0,
    isDraft: 0,
    publishedAt: now - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: crypto.randomUUID(),
    slug: "draft-thoughts-on-monorepos",
    title: "Thoughts on monorepos (draft)",
    category: "words:essay",
    excerpt: "Still forming these thoughts. Not ready yet.",
    content: doc(
      "The promise: one repo, shared code, atomic changes across packages. The reality: it works, mostly, until it doesn't.",
      "Turbo makes local dev tolerable. Remote caching makes CI tolerable. What nothing makes tolerable is the moment a transitive dependency update breaks six packages simultaneously and you spend a morning bisecting bun.lock.",
    ),
    readTime: 1,
    isCustomPage: 0,
    isDraft: 1,
    publishedAt: null,
  },
];

const insert = db.prepare(`
	INSERT OR IGNORE INTO posts
		(id, slug, title, category, excerpt, content, read_time, is_custom_page, is_draft, author_id, published_at, created_at, updated_at)
	VALUES
		(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let inserted = 0;
for (const p of posts) {
  const result = insert.run(
    p.id,
    p.slug,
    p.title,
    p.category,
    p.excerpt,
    p.content,
    p.readTime,
    p.isCustomPage,
    p.isDraft,
    authorId,
    p.publishedAt ?? null,
    now,
    now,
  );
  if (result.changes > 0) {
    inserted++;
    console.log(`  + ${p.title}`);
  } else {
    console.log(`  ~ ${p.title} (already exists, skipped)`);
  }
}

db.close();
console.log(`\nDone — ${inserted} post(s) inserted.`);
