import { defineBlock, type Field } from "../../define";

export const fields = [
  { slug: "title", label: "Title", type: "string" },
  { slug: "note", label: "Note under the title", type: "string" },
  {
    slug: "stickers",
    label: "Stickers",
    type: "repeater",
    validation: {
      subFields: [
        {
          slug: "image",
          label: "Sticker or meme",
          type: "image",
          required: true,
        },
        { slug: "caption", label: "Caption (optional)", type: "string" },
      ],
      maxItems: 200,
    },
  },
] as const satisfies readonly Field[];

export default defineBlock(
  "stickers",
  "Stickers",
  "A wall of stickers and memes, stuck on at an angle",
  fields,
);
