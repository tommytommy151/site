"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCatalogStore } from "@/lib/store/catalog-store";
import { cn } from "@/lib/utils";

export function MegaMenu({ label }: { label: string }) {
  const categories = useCatalogStore((s) => s.categories);
  const topLevel = categories.filter((c) => !c.parentId);
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={cn(
          "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
          open && "bg-muted text-foreground",
        )}
      >
        {label}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-1/2 z-50 w-[680px] -translate-x-1/2 pt-3"
          >
            <div className="glass grid grid-cols-3 gap-1 rounded-2xl p-3 shadow-xl">
              {topLevel.map((cat) => {
                const children = categories.filter((c) => c.parentId === cat.id);
                return (
                  <div key={cat.id} className="flex flex-col gap-2 rounded-xl p-2">
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="group flex flex-col gap-2"
                      onClick={() => setOpen(false)}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="220px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">{cat.productCount} produse</p>
                      </div>
                    </Link>
                    {children.length > 0 && (
                      <ul className="flex flex-col gap-0.5 border-t border-border/60 pt-1.5">
                        {children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/categories/${child.slug}`}
                              onClick={() => setOpen(false)}
                              className="block rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
