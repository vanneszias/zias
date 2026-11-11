import { initWasm, Resvg } from "@resvg/resvg-wasm";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";
import type { ReactElement } from "react";
import satori from "satori";
import { fonts } from "./fonts";
import { HEIGHT, WIDTH } from "./tokens";

let wasmReady: Promise<void> | undefined;

export async function renderPng(element: ReactElement): Promise<Uint8Array> {
  wasmReady ??= initWasm(resvgWasm);
  await wasmReady;
  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts: fonts.map((font) => ({ ...font })),
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
    .render()
    .asPng();
}
