import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "../../lib/utils";

/** shadcn Button, restyled to the system: flat, radius-soft, mono uppercase label (the z-button class). */
function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "outline";
  size?: "l";
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={asChild ? undefined : (type ?? "button")}
      className={cn("z-button", className)}
      {...props}
    />
  );
}

export { Button };
