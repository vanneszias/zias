import { type BlockValue, defineBlock, type Field } from "../../define";

export const fields = [
  { slug: "statement", label: "Sentence", type: "text", required: true },
  {
    slug: "status",
    label: "Status (shown with a green dot at the top of the page)",
    type: "string",
  },
] as const satisfies readonly Field[];

const intro = defineBlock(
  "intro",
  "Intro",
  "The large sentence a page opens with, and an optional status",
  fields,
);

export default intro;

/** The block's slug, for layouts that read its status. */
export const INTRO = intro.slug;
export type IntroValue = BlockValue<typeof fields>;
