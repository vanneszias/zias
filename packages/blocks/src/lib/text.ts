/** Splits editor text into its non-empty lines, for big words set one per line. */
export function lines(text: string | undefined): string[] {
  return (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
