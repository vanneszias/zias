import { defineBlock, type Field } from "../../define";

export const fields = [
  { slug: "word", label: "Big word", type: "string" },
  { slug: "tag", label: "Tag", type: "string" },
  { slug: "body", label: "Text", type: "portableText", required: true },
] as const satisfies readonly Field[];

export default defineBlock("text", "Text", "Running prose, for legal pages and longer notes", fields);
