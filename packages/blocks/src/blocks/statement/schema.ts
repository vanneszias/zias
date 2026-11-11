import { defineBlock, type Field } from "../../define";

export const fields = [
  { slug: "word", label: "Big word", type: "string" },
  { slug: "statement", label: "Statement", type: "text", required: true },
  { slug: "scribble", label: "Scribble (two or three words)", type: "string" },
  { slug: "tag", label: "Tag", type: "string" },
] as const satisfies readonly Field[];

export default defineBlock("statement", "Statement", "One sentence in statement type, with an optional big word", fields);
