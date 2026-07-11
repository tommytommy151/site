"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { useProductStore } from "@/lib/store/product-store";
import { stripBoilerplate } from "@/lib/strip-boilerplate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function InlineTextField({
  value,
  onCommit,
  className,
}: {
  value: string;
  onCommit: (value: string) => void;
  className?: string;
}) {
  const [draft, setDraft] = useState(value);

  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const next = draft.trim();
        if (next && next !== value) onCommit(next);
        else setDraft(value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setDraft(value);
          e.currentTarget.blur();
        }
      }}
      className={`w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 -mx-1.5 hover:border-border focus:border-primary focus:bg-background focus:outline-none ${className ?? ""}`}
    />
  );
}

function InlineNumberField({
  value,
  onCommit,
  min = 0,
  className,
}: {
  value: number;
  onCommit: (value: number) => void;
  min?: number;
  className?: string;
}) {
  const [draft, setDraft] = useState(String(value));

  return (
    <input
      type="number"
      min={min}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const next = Number(draft);
        if (!Number.isNaN(next) && next !== value) onCommit(next);
        else setDraft(String(value));
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setDraft(String(value));
          e.currentTarget.blur();
        }
      }}
      className={`w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 -mx-1.5 hover:border-border focus:border-primary focus:bg-background focus:outline-none ${className ?? ""}`}
    />
  );
}

export default function AdminProductsPage() {
  const products = useProductStore((s) => s.products);
  const patchProduct = useProductStore((s) => s.patchProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const affectedProducts = useMemo(
    () => products.filter((p) => /engros/i.test(p.name) || /engros/i.test(p.description)),
    [products],
  );

  function cleanupBoilerplate() {
    for (const p of affectedProducts) {
      patchProduct(p.id, { name: stripBoilerplate(p.name), description: stripBoilerplate(p.description) });
    }
  }

  const [query, setQuery] = useState("");

  const dedupedProducts = useMemo(() => {
    const seen = new Set<string>();
    return products.filter((p) => {
      const key = p.slug || p.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [products]);
  const uniqueProductCount = dedupedProducts.length;

  const filtered = useMemo(() => {
    return dedupedProducts.filter(
      (p) =>
        !query.trim() ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, dedupedProducts]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Produse</h1>
          <p className="mt-1 text-sm text-muted-foreground">{uniqueProductCount} produse în catalog.</p>
        </div>
        <div className="flex items-center gap-2">
          {affectedProducts.length > 0 && (
            <Button variant="outline" onClick={cleanupBoilerplate}>
              <Sparkles className="size-4" />
              Curăță &quot;Engros - EngrossOnline&quot; ({affectedProducts.length})
            </Button>
          )}
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="size-4" />
              Adaugă produs
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută produse..."
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Produs</th>
              <th className="p-4 font-medium">Categorie</th>
              <th className="p-4 font-medium">Preț</th>
              <th className="p-4 font-medium">Stoc</th>
              <th className="p-4 font-medium">Rating</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((product) => (
              <tr key={product.id}>
                <td className="flex items-center gap-3 p-4">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <InlineTextField
                      value={product.name}
                      onCommit={(name) => patchProduct(product.id, { name })}
                      className="truncate font-medium text-foreground"
                    />
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{product.category}</td>
                <td className="p-4 font-medium text-foreground">
                  <div className="flex items-center gap-1">
                    <InlineNumberField
                      value={product.price}
                      onCommit={(price) => patchProduct(product.id, { price })}
                    />
                    <span className="shrink-0 text-xs text-muted-foreground">RON</span>
                  </div>
                </td>
                <td className="p-4">
                  <InlineNumberField
                    value={product.stock}
                    onCommit={(stock) => patchProduct(product.id, { stock })}
                    className={product.stock <= 20 ? "text-destructive" : "text-foreground"}
                  />
                </td>
                <td className="p-4 text-muted-foreground">{product.rating.toFixed(1)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${product.id}`}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted-foreground">
                  Niciun produs găsit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
