import type * as React from "react";
import { cn } from "../../lib/utils";

/** The one icon: an arrow pointing up and right, sized by font-size. */
function Arrow({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      className={cn("z-arrow", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.6}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 19L18 6M8 5h11v11" />
    </svg>
  );
}

export { Arrow };
