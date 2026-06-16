import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "../lib/utils";

export type SectionVariant =
  | "hero"
  | "pink"
  | "blue"
  | "orange"
  | "footer"
  | "plain";

const SECTION_CLASSES: Record<SectionVariant, string> = {
  hero: "bg-section-hero   text-section-hero-fg",
  pink: "bg-section-pink   text-section-pink-fg",
  blue: "bg-section-blue   text-section-blue-fg",
  orange: "bg-section-orange text-section-orange-fg",
  footer: "bg-section-footer text-section-footer-fg",
  plain: "bg-background     text-foreground",
};

type SectionProps<T extends ElementType = "section"> = {
  as?: T;
  variant?: SectionVariant;
  children: ReactNode;
  className?: string;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "variant" | "children" | "className"
>;

/** Full-width color-block section. Pass `as="footer"` etc. for semantic HTML. */
export function Section<T extends ElementType = "section">({
  as,
  variant = "plain",
  className,
  children,
  ...props
}: SectionProps<T>) {
  const Tag = (as ?? "section") as ElementType;
  return (
    <Tag
      className={cn("relative w-full", SECTION_CLASSES[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface SectionInnerProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

/** Max-width container with horizontal padding — matches Figma's 96px gutters on 1920 canvas. */
export function SectionInner({
  className,
  children,
  ...props
}: SectionInnerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-2xl px-6 md:px-12 xl:px-24",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
