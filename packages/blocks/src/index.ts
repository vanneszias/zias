import contact from "./blocks/contact/schema";
import facts from "./blocks/facts/schema";
import hero from "./blocks/hero/schema";
import image from "./blocks/image/schema";
import links from "./blocks/links/schema";
import posts from "./blocks/posts/schema";
import statement from "./blocks/statement/schema";
import text from "./blocks/text/schema";
import word from "./blocks/word/schema";

/**
 * Every Zias block type, in the order the editor lists them. To add a block,
 * create `blocks/<name>/` with a `schema.ts` (via `defineBlock`) and a
 * `View.astro`, then add the schema here; `PageBlocks.astro` finds the view.
 */
export const blockTypes = [
  hero,
  statement,
  word,
  facts,
  posts,
  contact,
  links,
  image,
  text,
];

export const blockSlugs = blockTypes.map((block) => block.slug);

export type { BlockProps, BlockType, BlockValue } from "./define";
