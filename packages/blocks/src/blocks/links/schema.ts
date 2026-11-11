import { defineBlock, type Field, WORD_SIZES } from "../../define";

export const fields = [
  {
    slug: "links",
    label: "Links",
    type: "repeater",
    required: true,
    validation: {
      minItems: 1,
      maxItems: 8,
      subFields: [
        { slug: "label", label: "Word", type: "string", required: true },
        { slug: "url", label: "Link", type: "string", required: true },
      ],
    },
  },
  { slug: "size", label: "Size", type: "select", required: true, defaultValue: "big", validation: { options: WORD_SIZES } },
  { slug: "note", label: "Small print", type: "string" },
] as const satisfies readonly Field[];

export default defineBlock("links", "Links", "A row of arrow links, used to close a page", fields);
