/** Helpers shared by the Astro components. */

const TOKENS = new Set([
  "paper",
  "paper-bright",
  "ink",
  "ink-soft",
  "shout",
  "cobalt",
  "tomato",
  "butter",
  "pink",
]);

/** A colour token name or any CSS colour, as a CSS value. */
export function ink(color?: string): string | undefined {
  if (!color) return undefined;
  return TOKENS.has(color) ? `var(--${color})` : color;
}

/** Merge a passed-through `style` (string or object) with extra declarations. */
export function mergeStyle(
  style: unknown,
  extra: Record<string, string | undefined>,
): string | undefined {
  const own = Object.entries(extra)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  let given = "";
  if (typeof style === "string") given = style.trim().replace(/;$/, "");
  else if (style && typeof style === "object")
    given = Object.entries(style as Record<string, string | number>)
      .map(
        ([k, v]) => `${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${v}`,
      )
      .join(";");
  const out = [given, own].filter(Boolean).join(";");
  return out || undefined;
}

/** A boolean as a present-or-absent data attribute. */
export function flag(v: unknown): "" | undefined {
  return v ? "" : undefined;
}

export type Tone =
  | "paper"
  | "bright"
  | "ink"
  | "cobalt"
  | "tomato"
  | "butter"
  | "pink";
export type LoudTone = "cobalt" | "tomato" | "butter" | "pink";
export type WordSize = "colossal" | "giant" | "huge" | "big";
export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}
