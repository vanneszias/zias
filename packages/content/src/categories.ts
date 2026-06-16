export const POST_CATEGORIES = [
  "words:essay",
  "words:note",
  "work:case-study",
  "work:project",
  "misc",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  "words:essay": "Words · Essay",
  "words:note": "Words · Note",
  "work:case-study": "Work · Case study",
  "work:project": "Work · Project",
  misc: "Misc",
};

/** Maps a category to its Tailwind color token name (bg-card-{token}) */
export const CATEGORY_COLOR_TOKEN: Record<
  PostCategory,
  "words" | "work" | "misc"
> = {
  "words:essay": "words",
  "words:note": "words",
  "work:case-study": "work",
  "work:project": "work",
  misc: "misc",
};
