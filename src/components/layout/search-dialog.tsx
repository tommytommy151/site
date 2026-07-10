"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, TrendingUp, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useProductStore } from "@/lib/store/product-store";
import { formatPrice } from "@/lib/format";

const POPULAR_SEARCHES = ["Robot de bucătărie", "Husă telefon", "Powerbank", "Sneakers", "Geacă bomber"];

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const products = useProductStore((s) => s.products);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, products]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed top-[12%] left-1/2 z-50 w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl focus:outline-none">
          <Dialog.Title className="sr-only">Caută produse</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută produse, branduri, categorii..."
              className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
            <Dialog.Close className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-3">
            {query.trim() === "" ? (
              <div className="px-2 py-3">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <TrendingUp className="size-3.5" /> Căutări populare
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-full bg-muted px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-brand-emerald-soft hover:text-brand-emerald"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                Niciun rezultat pentru &ldquo;{query}&rdquo;
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatPrice(p.price, p.currency)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
