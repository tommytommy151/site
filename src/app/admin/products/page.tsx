"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { useProductStore, type ProductFormInput } from "@/lib/store/product-store";
import { useCatalogStore, slugify } from "@/lib/store/catalog-store";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { stripBoilerplate } from "@/lib/strip-boilerplate";
import { Input } from "@/components/ui/input";
import { ImageUploadInput } from "@/components/admin/image-upload-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMPTY_FORM: ProductFormInput = {
  name: "",
  slug: "",
  brand: "",
  brandSlug: "",
  category: "",
  categorySlug: "",
  price: 0,
  compareAtPrice: undefined,
  stock: 0,
  image: "",
  description: "",
  badges: [],
};

export default function AdminProductsPage() {
  const products = useProductStore((s) => s.products);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const patchProduct = useProductStore((s) => s.patchProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const categories = useCatalogStore((s) => s.categories);
  const brands = useCatalogStore((s) => s.brands);

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
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormInput>(EMPTY_FORM);

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

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      brandSlug: product.brandSlug,
      category: product.category,
      categorySlug: product.categorySlug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.stock,
      image: product.images[0] ?? "",
      description: product.description,
      badges: product.badges,
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.category || !form.brand) return;
    const payload: ProductFormInput = { ...form, slug: form.slug || slugify(form.name) };
    if (editing) {
      updateProduct(editing.id, payload);
    } else {
      addProduct(payload);
    }
    setOpen(false);
  }

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
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Adaugă produs
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
                    <p className="truncate font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{product.category}</td>
                <td className="p-4 font-medium text-foreground">{formatPrice(product.price)}</td>
                <td className="p-4">
                  <span className={product.stock <= 20 ? "text-destructive" : "text-foreground"}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{product.rating.toFixed(1)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(product)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editează produsul" : "Produs nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="p-name" className="mb-1.5">
                Nume produs
              </Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Field Monitor 40"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5">Brand</Label>
                <Select
                  value={form.brandSlug}
                  onValueChange={(value) => {
                    const brand = brands.find((b) => b.slug === value);
                    if (!brand) return;
                    setForm((f) => ({ ...f, brand: brand.name, brandSlug: brand.slug }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Alege brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.slug}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5">Categorie</Label>
                <Select
                  value={form.categorySlug}
                  onValueChange={(value) => {
                    const category = categories.find((c) => c.slug === value);
                    if (!category) return;
                    setForm((f) => ({
                      ...f,
                      category: category.name,
                      categorySlug: category.slug,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Alege categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="p-price" className="mb-1.5">
                  Preț (RON)
                </Label>
                <Input
                  id="p-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="p-stock" className="mb-1.5">
                  Stoc
                </Label>
                <Input
                  id="p-stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) || 0 }))}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="p-image" className="mb-1.5">
                URL imagine
              </Label>
              <ImageUploadInput
                id="p-image"
                value={form.image}
                onChange={(image) => setForm((f) => ({ ...f, image }))}
              />
            </div>
            <div>
              <Label htmlFor="p-description" className="mb-1.5">
                Descriere
              </Label>
              <Textarea
                id="p-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="min-h-20"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editing ? "Salvează modificările" : "Adaugă produsul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
