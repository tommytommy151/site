"use client";

import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCatalogStore } from "@/lib/store/catalog-store";

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
  const categories = useCatalogStore((s) => s.categories);

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
          {categories
            .filter((cat) => !cat.parentId)
            .map((cat) => (
              <div key={cat.id} className="flex flex-col">
                <Link
                  href={`/categories/${cat.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[15px] text-foreground hover:bg-muted"
                >
                  <span className="relative size-4 shrink-0 overflow-hidden rounded-full bg-muted">
                    {cat.image && (
                      <Image src={cat.image} alt="" fill sizes="16px" className="object-cover" unoptimized />
                    )}
                  </span>
                  {cat.name}
                </Link>
                {categories
                  .filter((child) => child.parentId === cat.id)
                  .map((child) => (
                    <Link
                      key={child.id}
                      href={`/categories/${child.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 pl-7 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <span className="relative size-3.5 shrink-0 overflow-hidden rounded-full bg-muted">
                        {child.image && (
                          <Image
                            src={child.image}
                            alt=""
                            fill
                            sizes="14px"
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </span>
                      {child.name}
                    </Link>
                  ))}
              </div>
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
