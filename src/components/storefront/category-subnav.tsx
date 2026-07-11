"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCatalogStore } from "@/lib/store/catalog-store";

export function CategorySubnav({ slug }: { slug: string }) {
  const categories = useCatalogStore((s) => s.categories);
  const current = categories.find((c) => c.slug === slug);
  if (!current) return null;

  const parent = current.parentId
    ? categories.find((c) => c.id === current.parentId)
    : null;
  const children = categories.filter((c) => c.parentId === current.id);

  return (
    <div className="mb-6 flex flex-col gap-3">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Acasă
        </Link>
        <ChevronRight className="size-3.5" />
        <span>Categorii</span>
        {parent && (
          <>
            <ChevronRight className="size-3.5" />
            <Link href={`/categories/${parent.slug}`} className="hover:text-foreground">
              {parent.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{current.name}</span>
      </nav>

      {children.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/categories/${child.slug}`}
              className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-foreground/75 transition-colors hover:border-brand-emerald hover:text-brand-emerald"
            >
              <span className="relative size-4 shrink-0 overflow-hidden rounded-full bg-muted">
                {child.image && (
                  <Image
                    src={child.image}
                    alt=""
                    fill
                    sizes="16px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </span>
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
