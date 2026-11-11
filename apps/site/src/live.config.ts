import { defineLiveCollection } from "astro:content";
import { emdashLoader } from "emdash/runtime";

/** EmDash serves every collection through this one live collection. */
export const collections = {
  _emdash: defineLiveCollection({ loader: emdashLoader() }),
};
