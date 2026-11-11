import type { TONES } from "../define";

export type Tone = (typeof TONES)[number];

const LOUD = ["cobalt", "butter", "pink", "tomato", "ink"] as const;

/** Paper grounds take the `shout` colour for a loud word or scribble; loud grounds keep their own text colour. */
export function shoutOn(tone: Tone | undefined): "shout" | undefined {
  return !tone || tone === "paper" || tone === "bright" ? "shout" : undefined;
}

/** Card tones for a grid on this ground: never the ground itself, cycled in order. */
export function cardTone(ground: Tone | undefined, index: number) {
  const tones = LOUD.filter((tone) => tone !== ground);
  return tones[index % tones.length];
}

/** A big word is a page's `h1` in its first block and an `h2` after that. */
export function headingFor(index: number) {
  return index === 0 ? "h1" : "h2";
}
