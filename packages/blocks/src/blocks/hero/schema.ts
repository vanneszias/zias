import {
  defineBlock,
  type Field,
  LINK_PATTERN,
  WORD_SIZES,
} from "../../define";

export const fields = [
  {
    slug: "words",
    label: "Big words (one line each)",
    type: "text",
    required: true,
  },
  {
    slug: "size",
    label: "Size",
    type: "select",
    required: true,
    defaultValue: "giant",
    validation: { options: WORD_SIZES },
  },
  { slug: "statement", label: "Statement", type: "text" },
  { slug: "scribble", label: "Scribble (two or three words)", type: "string" },
  { slug: "sticker", label: "Sticker (instead of a scribble)", type: "string" },
  { slug: "action_label", label: "Button text", type: "string" },
  {
    slug: "action_url",
    label: "Button link",
    type: "string",
    validation: { pattern: LINK_PATTERN },
  },
] as const satisfies readonly Field[];

export default defineBlock(
  "hero",
  "Hero",
  "The page opener: big words, a statement and one action",
  fields,
);
