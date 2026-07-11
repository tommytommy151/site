"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCatalogStore } from "@/lib/store/catalog-store";
import { cn } from "@/lib/utils";

export function CategorySidebar() {
  const categories = useCatalogStore((s) => s.categories);
  const pathname = usePathname();
  const topLevel = categories.filter((c) => !c.parentId);

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-24 flex flex-col gap-1">
        <p className="mb-2 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Categorii
        </p>
        {topLevel.map((cat) => {
          const children = categories.filter((c) => c.parentId === cat.id);
          const active = pathname === `/categories/${cat.slug}`;
          return (
            <div key={cat.id} className="flex flex-col">
              <Link
                href={`/categories/${cat.slug}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-emerald-soft text-brand-emerald"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="relative size-4 shrink-0 overflow-hidden rounded-full bg-muted">
                  {cat.image && (
                    <Image src={cat.image} alt="" fill sizes="16px" className="object-cover" unoptimized />
                  )}
                </span>
                {cat.name}
              </Link>
              {children.length > 0 && (
                <div className="flex flex-col">
                  {children.map((child) => {
                    const childActive = pathname === `/categories/${child.slug}`;
                    return (
                      <Link
                        key={child.id}
                        href={`/categories/${child.slug}`}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-1.5 pl-6 text-sm transition-colors",
                          childActive
                            ? "text-brand-emerald"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
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
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
