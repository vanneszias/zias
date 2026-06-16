import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    /** PostCategory value e.g. "words:essay" */
    category: text("category").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    /** Tiptap JSON string — null for custom React pages */
    content: text("content"),
    readTime: integer("read_time").notNull().default(1),
    isCustomPage: integer("is_custom_page", { mode: "boolean" })
      .notNull()
      .default(false),
    isDraft: integer("is_draft", { mode: "boolean" }).notNull().default(true),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("posts_slug_idx").on(t.slug),
    index("posts_publishedAt_idx").on(t.publishedAt),
    index("posts_category_idx").on(t.category),
  ],
);

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(user, { fields: [posts.authorId], references: [user.id] }),
}));
