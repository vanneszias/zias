import { FAMILY } from "./fonts";

export const WIDTH = 1200;
export const HEIGHT = 630;

const PAPER = "#fff";
const INK = "#000";
const SIGNAL = "#00c853";
const EDGE = 64;
const SMALL = 34;

/** The logo: a Z whose full stop is the site's green dot. */
function Mark({ size }: { size: number }) {
  const dot = size * 0.13;
  return (
    <div style={{ display: "flex", alignItems: "flex-end" }}>
      <div style={{ display: "flex", fontSize: size, lineHeight: 0.74 }}>Z</div>
      <div
        style={{
          width: dot,
          height: dot,
          marginLeft: size * 0.04,
          borderRadius: dot,
          background: SIGNAL,
        }}
      />
    </div>
  );
}

/** Pick a size that keeps the text inside roughly five lines. */
function textSize(text: string) {
  const n = text.length;
  if (n <= 12) return 220;
  if (n <= 30) return 150;
  if (n <= 60) return 112;
  if (n <= 120) return 84;
  return 68;
}

/** Every card: the name, one line of text, an italic note and the logo, black on white. */
export function Card({ text, note }: { text: string; note?: string }) {
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: EDGE,
        background: PAPER,
        color: INK,
        fontFamily: FAMILY,
        fontSize: SMALL,
      }}
    >
      <div style={{ display: "flex" }}>Zias van Nes</div>
      <div
        style={{
          display: "flex",
          fontSize: textSize(text),
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
          maxHeight: 380,
          overflow: "hidden",
        }}
      >
        {text}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", fontStyle: "italic" }}>
          {note ?? "zias.be"}
        </div>
        <Mark size={96} />
      </div>
    </div>
  );
}
