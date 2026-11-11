import { defineBlock, type Field } from "../../define";
import { CONTACT_FORM } from "./form";

export const fields = [
  {
    slug: "word",
    label: "Big word",
    type: "string",
    required: true,
    defaultValue: "say hi.",
  },
  { slug: "statement", label: "Statement", type: "text" },
  {
    slug: "form",
    label: "Form slug (from Plugins > Forms)",
    type: "string",
    required: true,
    defaultValue: CONTACT_FORM.slug,
  },
  { slug: "email", label: "Email shown beside the form", type: "string" },
] as const satisfies readonly Field[];

export default defineBlock(
  "contact",
  "Contact",
  "A big word, a statement and the contact form",
  fields,
);
