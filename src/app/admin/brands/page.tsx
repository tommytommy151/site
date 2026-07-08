"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCatalogStore, slugify } from "@/lib/store/catalog-store";
import type { Brand } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<Brand, "id">;

const EMPTY_FORM: FormState = { name: "", slug: "", logo: "", productCount: 0 };

export default function AdminBrandsPage() {
  const brands = useCatalogStore((s) => s.brands);
  const addBrand = useCatalogStore((s) => s.addBrand);
  const updateBrand = useCatalogStore((s) => s.updateBrand);
  const deleteBrand = useCatalogStore((s) => s.deleteBrand);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlugEdited(false);
    setOpen(true);
  }

  function openEdit(brand: Brand) {
    setEditingId(brand.id);
    setForm({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      productCount: brand.productCount,
    });
    setSlugEdited(true);
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return;
    const payload: FormState = {
      ...form,
      slug: slugify(form.slug),
      logo: form.logo.trim() || form.name.trim(),
    };
    if (editingId) {
      updateBrand(editingId, payload);
    } else {
      addBrand(payload);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Producători</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {brands.length} branduri — apar pe homepage și în filtrele de produse.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă producător
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Nume</th>
              <th className="p-4 font-medium">URL</th>
              <th className="p-4 font-medium">Produse</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td className="p-4 font-medium text-foreground">{brand.name}</td>
                <td className="p-4 font-mono text-xs text-muted-foreground">
                  /brands/{brand.slug}
                </td>
                <td className="p-4 text-muted-foreground">{brand.productCount}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(brand)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteBrand(brand.id)}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează producătorul" : "Producător nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="brand-name" className="mb-1.5">
                Nume brand
              </Label>
              <Input
                id="brand-name"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, slug: slugEdited ? f.slug : slugify(name) }));
                }}
                placeholder="ex. Auric"
                required
              />
            </div>
            <div>
              <Label htmlFor="brand-slug" className="mb-1.5">
                URL (slug)
              </Label>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">/brands/</span>
                <Input
                  id="brand-slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="brand-count" className="mb-1.5">
                Număr produse afișat
              </Label>
              <Input
                id="brand-count"
                type="number"
                min={0}
                value={form.productCount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, productCount: Number(e.target.value) || 0 }))
                }
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă producătorul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
