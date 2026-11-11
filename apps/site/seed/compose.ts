import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { blockSlugs, blockTypes } from "@zias/blocks";
import type { AstroIntegration } from "astro";

interface Seed {
  collections?: {
    slug: string;
    fields: { type: string; validation?: Record<string, unknown> }[];
  }[];
  content?: Record<string, { slug: string; data: Record<string, unknown> }[]>;
}

/**
 * The block schemas live in `@zias/blocks`, the rest of the seed in
 * `seed/seed.json`. On every `astro` command this writes the two together to
 * `.emdash/seed.json`, the first place EmDash looks, so the seed it applies
 * can never lag behind the blocks. Every `blocks` field allows every block.
 */
export function composeSeed(): AstroIntegration {
  return {
    name: "zias:seed",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        const seed: Seed = JSON.parse(
          readFileSync(new URL("seed/seed.json", config.root), "utf8"),
        );
        for (const field of seed.collections?.flatMap((c) => c.fields) ?? []) {
          if (field.type === "blocks")
            field.validation = {
              ...field.validation,
              allowedTypes: blockSlugs,
            };
        }
        for (const [collection, entries] of Object.entries(
          seed.content ?? {},
        )) {
          for (const entry of entries) {
            const blocks = Object.values(entry.data)
              .filter(Array.isArray)
              .flat();
            const unknown = blocks.find(
              (b) =>
                b._type?.startsWith("zias_") && !blockSlugs.includes(b._type),
            );
            if (unknown)
              throw new Error(
                `seed: ${collection}/${entry.slug} uses unknown block "${unknown._type}"`,
              );
          }
        }
        const out = new URL(".emdash/", config.root);
        mkdirSync(out, { recursive: true });
        writeFileSync(
          new URL("seed.json", out),
          `${JSON.stringify({ ...seed, blockTypes }, null, 2)}\n`,
        );
        logger.debug(
          `wrote .emdash/seed.json with ${blockTypes.length} block types`,
        );
      },
    },
  };
}
