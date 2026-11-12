import image from "./blocks/image/schema";
import intro from "./blocks/intro/schema";
import posts from "./blocks/posts/schema";
import stickers from "./blocks/stickers/schema";
import text from "./blocks/text/schema";

/**
 * Every Zias block type, in the order the editor lists them. To add a block,
 * create `blocks/<name>/` with a `schema.ts` (via `defineBlock`) and a
 * `View.astro`, then add the schema here; `PageBlocks.astro` finds the view.
 */
export const blockTypes = [intro, posts, text, image, stickers];

export const blockSlugs = blockTypes.map((block) => block.slug);

export { INTRO, type IntroValue } from "./blocks/intro/schema";
export type { BlockProps, BlockType, BlockValue } from "./define";
