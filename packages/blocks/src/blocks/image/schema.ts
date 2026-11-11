import { defineBlock, type Field } from "../../define";

export const fields = [
  { slug: "image", label: "Image", type: "image", required: true },
  { slug: "caption", label: "Caption", type: "string" },
] as const satisfies readonly Field[];

export default defineBlock(
  "image",
  "Image",
  "A full-width image with an optional caption",
  fields,
);
