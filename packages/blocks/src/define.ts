import type { ImageValue, PortableTextBlock } from "emdash";

/** Prefix for every block slug, so ours never clash with a plugin's. */
export const PREFIX = "zias_";

interface Base {
  slug: string;
  label: string;
  required?: boolean;
}

type SubField = Base &
  (
    | { type: "string" | "text" | "url" }
    | { type: "select"; options: readonly string[] }
  );

/** The subset of EmDash block field definitions the Zias blocks use. */
export type Field = Base &
  (
    | {
        type: "string" | "text" | "url";
        defaultValue?: string;
        validation?: { pattern?: string; maxLength?: number };
      }
    | {
        type: "integer" | "number";
        defaultValue?: number;
        validation?: { min?: number; max?: number };
      }
    | { type: "boolean"; defaultValue?: boolean }
    | {
        type: "select";
        defaultValue?: string;
        validation: { options: readonly string[] };
      }
    | { type: "portableText" | "image" }
    | {
        type: "repeater";
        validation: {
          subFields: readonly SubField[];
          minItems?: number;
          maxItems?: number;
        };
      }
  );

type ValueOf<F> = F extends {
  type: "select";
  validation: { options: readonly (infer O)[] };
}
  ? O
  : F extends { type: "select"; options: readonly (infer O)[] }
    ? O
    : F extends { type: "string" | "text" | "url" }
      ? string
      : F extends { type: "integer" | "number" }
        ? number
        : F extends { type: "boolean" }
          ? boolean
          : F extends { type: "portableText" }
            ? PortableTextBlock[]
            : F extends { type: "image" }
              ? ImageValue
              : F extends {
                    type: "repeater";
                    validation: { subFields: infer S extends readonly Base[] };
                  }
                ? Values<S>[]
                : never;

type Values<FS extends readonly Base[]> = {
  [F in FS[number] as F extends { required: true }
    ? F["slug"]
    : never]: ValueOf<F>;
} & {
  [F in FS[number] as F extends { required: true }
    ? never
    : F["slug"]]?: ValueOf<F>;
};

/** The stored value of a block with these fields, as its renderer receives it. */
export type BlockValue<FS extends readonly Field[]> = Values<FS> & {
  _type: string;
  _key: string;
  _version: number;
};

/** Props of a block renderer, as passed by EmDash's `<Blocks>`. */
export interface BlockProps<FS extends readonly Field[]> {
  value: BlockValue<FS>;
  index: number;
  blockKey: string;
}

/**
 * A block type for the seed: `name` becomes the slug (`zias_<name>`) and must
 * match the block's folder, which holds its `View.astro` renderer.
 */
export function defineBlock(
  name: string,
  label: string,
  description: string,
  fields: readonly Field[],
) {
  return {
    slug: `${PREFIX}${name}`,
    label,
    description,
    category: "Zias",
    currentVersion: 1,
    versions: [{ version: 1, fields: [...fields] }],
  };
}

export type BlockType = ReturnType<typeof defineBlock>;
