"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function FrequentlyBoughtTogether({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const addItem = useCartStore((s) => s.addItem);
  const items = [product, ...related].slice(0, 3);
  const [selected, setSelected] = useState<Set<string>>(new Set(items.map((p) => p.id)));

  if (items.length < 2) return null;

  function toggle(id: string) {
    if (id === product.id) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const total = items.filter((p) => selected.has(p.id)).reduce((sum, p) => sum + p.price, 0);

  function handleAddAll() {
    for (const p of items) {
      if (!selected.has(p.id)) continue;
      const variant = p.variants[0];
      if (variant) addItem(p, variant);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-4 text-sm font-semibold text-foreground">Frecvent cumpărate împreună</p>

      <div className="flex flex-wrap items-center gap-3">
        {items.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            {i > 0 && <Plus className="size-4 shrink-0 text-muted-foreground" />}
            <Link
              href={`/products/${p.slug}`}
              className="flex w-20 flex-col items-center gap-1.5 text-center"
            >
              <div className="relative size-16 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="line-clamp-2 text-[11px] text-muted-foreground">{p.name}</span>
              <span className="text-xs font-medium text-foreground">{formatPrice(p.price)}</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          {items.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-xs text-foreground/85">
              <Checkbox
                checked={selected.has(p.id)}
                onCheckedChange={() => toggle(p.id)}
                disabled={p.id === product.id}
              />
              <span className="max-w-48 truncate">{p.name}</span>
              <span className="text-muted-foreground">{formatPrice(p.price)}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="text-lg font-semibold text-foreground">{formatPrice(total)}</span>
          <Button onClick={handleAddAll} disabled={selected.size === 0}>
            Adaugă {selected.size} în coș
          </Button>
        </div>
      </div>
    </div>
  );
}
