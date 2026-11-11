import italic from "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff";
import regular from "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff";

export const FAMILY = "Instrument Serif";

export const fonts = [
  { name: FAMILY, data: regular, weight: 400, style: "normal" },
  { name: FAMILY, data: italic, weight: 400, style: "italic" },
] as const;
