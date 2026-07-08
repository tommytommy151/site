"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { products as allProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminProductsPage() {
  const [query, setQuery] = useState("");
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return allProducts
      .filter((p) => !deletedIds.includes(p.id))
      .filter(
        (p) =>
          !query.trim() ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()),
      );
  }, [query, deletedIds]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Produse</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {allProducts.length - deletedIds.length} produse în catalog.
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Adaugă produs
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Produs nou</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAddOpen(false);
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <Label htmlFor="p-name" className="mb-1.5">
                  Nume produs
                </Label>
                <Input id="p-name" placeholder="ex. Field Monitor 40" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="p-brand" className="mb-1.5">
                    Brand
                  </Label>
                  <Input id="p-brand" placeholder="ex. Auric" />
                </div>
                <div>
                  <Label htmlFor="p-price" className="mb-1.5">
                    Preț (RON)
                  </Label>
                  <Input id="p-price" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <Label htmlFor="p-stock" className="mb-1.5">
                  Stoc
                </Label>
                <Input id="p-stock" type="number" placeholder="0" />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">
                  Salvează produsul
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{product.category}</td>
                <td className="p-4 font-medium text-foreground">{formatPrice(product.price)}</td>
                <td className="p-4">
                  <span
                    className={
                      product.stock <= 20
                        ? "text-destructive"
                        : "text-foreground"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{product.rating.toFixed(1)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletedIds((ids) => [...ids, product.id])}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
