import { MARK_PATH, MARK_RATIO } from "./mark";
import { color, GUTTER, HEIGHT, type Tone, WIDTH } from "./tokens";

const display = "Archivo";
const mono = "DM Mono";

export function Mark({ fill, height }: { fill: string; height: number }) {
  return (
    <svg
      width={height * MARK_RATIO}
      height={height}
      viewBox="0 0 30 28.2"
      fill="none"
    >
      <path d={MARK_PATH} fill={fill} />
    </svg>
  );
}

/** Heavy up-and-right arrow with a square stroke, the one Zias icon. */
export function Arrow({ fill, size }: { fill: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 19 L18 6 M8 5 H19 V16"
        stroke={fill}
        strokeWidth={3.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function Label({ children, fg }: { children: string; fg: string }) {
  return (
    <div
      style={{
        fontFamily: mono,
        fontWeight: 500,
        fontSize: 26,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: fg,
        display: "flex",
      }}
    >
      {children}
    </div>
  );
}

const frame = {
  width: WIDTH,
  height: HEIGHT,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: GUTTER,
} as const;

/** One huge word on a flat ground, with the arrow. Used for the site and index pages. */
export function WordImage({
  word,
  tone,
  top,
  bottom,
  arrow = color.butter,
}: {
  word: string;
  tone: Tone;
  top: string;
  bottom: string;
  arrow?: string;
}) {
  const fontSize = word.length <= 5 ? 400 : word.length <= 7 ? 300 : 230;
  return (
    <div style={{ ...frame, background: tone.bg, color: tone.fg }}>
      <Label fg={tone.fg}>{top}</Label>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize,
            lineHeight: 0.78,
            letterSpacing: "-0.065em",
            marginLeft: -8,
          }}
        >
          {word}
        </div>
        <div style={{ display: "flex", marginLeft: 32, marginBottom: 16 }}>
          <Arrow fill={arrow} size={Math.round(fontSize * 0.3)} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Label fg={tone.fg}>{bottom}</Label>
        <Label fg={tone.fg}>zias.be</Label>
      </div>
    </div>
  );
}

/** Pick a headline size that keeps the title inside roughly four lines. */
function headlineSize(title: string) {
  const n = title.length;
  if (n <= 14) return 190;
  if (n <= 28) return 140;
  if (n <= 50) return 104;
  if (n <= 80) return 80;
  return 64;
}

export function PostImage({
  title,
  tone,
  tag,
}: {
  title: string;
  tone: Tone;
  tag: string;
}) {
  const size = headlineSize(title);
  return (
    <div style={{ ...frame, background: tone.bg, color: tone.fg }}>
      <Label fg={tone.fg}>{tag}</Label>
      <div
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 0.9,
          letterSpacing: size > 100 ? "-0.055em" : "-0.045em",
          marginLeft: -4,
          display: "flex",
          maxHeight: 400,
          overflow: "hidden",
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Label fg={tone.fg}>zias.be</Label>
        <Mark fill={tone.fg} height={64} />
      </div>
    </div>
  );
}
