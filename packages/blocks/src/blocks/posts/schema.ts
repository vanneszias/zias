import { defineBlock, type Field } from "../../define";

export const fields = [
  {
    slug: "word",
    label: "Big word",
    type: "string",
    required: true,
    defaultValue: "journal.",
  },
  {
    slug: "count",
    label: "Number of posts",
    type: "integer",
    required: true,
    defaultValue: 4,
    validation: { min: 1, max: 12 },
  },
  {
    slug: "category",
    label: "Category slug (empty for all posts)",
    type: "string",
  },
  {
    slug: "link_label",
    label: "Link to the journal",
    type: "string",
    defaultValue: "Read the journal",
  },
] as const satisfies readonly Field[];

export default defineBlock(
  "posts",
  "Posts",
  "The latest journal posts as cards",
  fields,
);
