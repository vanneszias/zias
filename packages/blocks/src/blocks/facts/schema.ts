import { defineBlock, type Field } from "../../define";

export const fields = [
  { slug: "word", label: "Big word", type: "string" },
  {
    slug: "facts",
    label: "Facts",
    type: "repeater",
    required: true,
    validation: {
      minItems: 1,
      maxItems: 6,
      subFields: [
        { slug: "label", label: "Label", type: "string", required: true },
        { slug: "value", label: "Value", type: "string", required: true },
      ],
    },
  },
] as const satisfies readonly Field[];

export default defineBlock("facts", "Facts", "Label and value rows", fields);
