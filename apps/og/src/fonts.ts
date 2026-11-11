import archivo900 from "@fontsource/archivo/files/archivo-latin-900-normal.woff";
import dmMono500 from "@fontsource/dm-mono/files/dm-mono-latin-500-normal.woff";

export const fonts = [
  { name: "Archivo", data: archivo900, weight: 900, style: "normal" },
  { name: "DM Mono", data: dmMono500, weight: 500, style: "normal" },
] as const;
