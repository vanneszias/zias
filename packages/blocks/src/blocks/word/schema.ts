import {
  defineBlock,
  type Field,
  LINK_PATTERN,
  WORD_SIZES,
} from "../../define";

export const fields = [
  { slug: "word", label: "Word", type: "string", required: true },
  {
    slug: "size",
    label: "Size",
    type: "select",
    required: true,
    defaultValue: "colossal",
    validation: { options: WORD_SIZES },
  },
  {
    slug: "url",
    label: "Link (turns the word into an arrow link)",
    type: "string",
    validation: { pattern: LINK_PATTERN },
  },
  {
    slug: "color",
    label: "Word colour (default: the block's text colour)",
    type: "select",
    validation: {
      options: ["shout", "cobalt", "tomato", "butter", "pink", "ink", "paper"],
    },
  },
  { slug: "outline", label: "Outline", type: "boolean", defaultValue: false },
  {
    slug: "wide",
    label: "Wide capitals",
    type: "boolean",
    defaultValue: false,
  },
] as const satisfies readonly Field[];

export default defineBlock(
  "word",
  "Word",
  "One big word, optionally a link",
  fields,
);
