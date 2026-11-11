import { Arrow } from "./ui/arrow";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export interface MobileMenuProps {
  links: { label: string; href: string; active?: boolean }[];
  action?: { label: string; href: string };
  className?: string;
}

/** A "Menu" button that opens a full-screen ink sheet of big-word links. Esc closes; focus is trapped. */
export function MobileMenu({ links, action, className }: MobileMenuProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={className}
          style={{ padding: "0.65rem 0.85rem" }}
        >
          Menu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex items-center justify-between">
          <DialogTitle className="z-tag">Menu</DialogTitle>
          <DialogClose asChild>
            <Button variant="outline" style={{ padding: "0.65rem 0.85rem" }}>
              Close
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="sr-only">
          Site navigation
        </DialogDescription>
        <nav aria-label="Menu" className="py-space-4 my-auto flex flex-col">
          {links.map((l) => (
            <DialogClose asChild key={l.href}>
              <a
                href={l.href}
                className="z-word"
                data-size="huge"
                data-outline={l.active ? "" : undefined}
                aria-current={l.active ? "page" : undefined}
              >
                {l.label}
              </a>
            </DialogClose>
          ))}
        </nav>
        {action && (
          <div>
            <DialogClose asChild>
              <Button asChild size="l" data-tone="butter">
                <a href={action.href}>
                  {action.label}
                  <Arrow />
                </a>
              </Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
