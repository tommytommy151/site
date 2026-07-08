"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { categories } from "@/lib/data/categories";

interface NavLink {
  label: string;
  href: string;
  megaMenu?: boolean;
}

export function MobileNav({
  open,
  onOpenChange,
  navLinks,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navLinks: NavLink[];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[85%] max-w-sm gap-0 p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle>Meniu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 overflow-y-auto p-4">
          {navLinks
            .filter((l) => !l.megaMenu)
            .map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => onOpenChange(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}

          <p className="mt-4 mb-1 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Categorii
          </p>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-3 py-2.5 text-[15px] text-foreground hover:bg-muted"
            >
              {cat.name}
            </Link>
          ))}

          <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">
            <Link
              href="/account"
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-3 py-2.5 text-[15px] text-foreground hover:bg-muted"
            >
              Cont
            </Link>
            <Link
              href="/account/wishlist"
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-3 py-2.5 text-[15px] text-foreground hover:bg-muted"
            >
              Favorite
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
