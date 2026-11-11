import { useCallback } from "react";
import { Button } from "./ui/button";

/**
 * Flips data-theme on <html> and remembers it in localStorage.theme.
 * The label is chosen by CSS from the current theme, so it is right before hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }, []);

  return (
    <Button
      variant="outline"
      onClick={toggle}
      className={className}
      style={{ padding: "0.65rem 0.85rem" }}
    >
      <span className="sr-only">Switch to </span>
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
    </Button>
  );
}
