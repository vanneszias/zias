import { defineBlock, type Field } from "../../define";

export const fields = [
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
    label: "Link to the journal (empty for no link)",
    type: "string",
    defaultValue: "All writing",
  },
] as const satisfies readonly Field[];

export default defineBlock(
  "posts",
  "Posts",
  "The latest journal posts as a list",
  fields,
);
