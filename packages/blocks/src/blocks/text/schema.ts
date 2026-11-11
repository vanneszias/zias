import { defineBlock, type Field } from "../../define";

export const fields = [
  { slug: "title", label: "Title", type: "string" },
  { slug: "note", label: "Note under the title", type: "string" },
  { slug: "body", label: "Text", type: "portableText", required: true },
] as const satisfies readonly Field[];

export default defineBlock(
  "text",
  "Text",
  "Running text with an optional title, for legal pages and longer notes",
  fields,
);
