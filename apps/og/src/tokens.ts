// Colour and type tokens from the Zias "big type" design system. Flat colour only.
export const color = {
  paper: "#f6f1e7",
  ink: "#17130f",
  cobalt: "#2740e6",
  onCobalt: "#f6f1e7",
  tomato: "#f03d1a",
  butter: "#ffd84a",
  onButter: "#17130f",
  pink: "#ffb3d1",
  onPink: "#17130f",
} as const;

export const WIDTH = 1200;
export const HEIGHT = 630;
export const GUTTER = 48;

export type Tone = { bg: string; fg: string };

export const tones = {
  cobalt: { bg: color.cobalt, fg: color.onCobalt },
  butter: { bg: color.butter, fg: color.onButter },
  pink: { bg: color.pink, fg: color.onPink },
} as const satisfies Record<string, Tone>;

/** Category term slug -> tone. Unknown categories get cobalt. */
export function toneForCategory(slug: string | null): Tone {
  switch (slug) {
    case "work":
    case "case-study":
    case "project":
      return tones.butter;
    case "misc":
      return tones.pink;
    default:
      return tones.cobalt;
  }
}
