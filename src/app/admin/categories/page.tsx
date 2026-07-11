"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCatalogStore, slugify } from "@/lib/store/catalog-store";
import type { Category } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploadInput } from "@/components/admin/image-upload-input";
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

type FormState = Omit<Category, "id">;

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  image: "",
  productCount: 0,
  description: "",
  parentId: null,
};

const NO_PARENT = "none";

export default function AdminCategoriesPage() {
  const categories = useCatalogStore((s) => s.categories);
  const addCategory = useCatalogStore((s) => s.addCategory);
  const updateCategory = useCatalogStore((s) => s.updateCategory);
  const deleteCategory = useCatalogStore((s) => s.deleteCategory);

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

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      productCount: cat.productCount,
      description: cat.description,
      parentId: cat.parentId ?? null,
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
      image: form.image.trim() || "https://picsum.photos/seed/new-category/900/1100",
    };
    if (editingId) {
      updateCategory(editingId, payload);
    } else {
      addCategory(payload);
    }
    setOpen(false);
  }

  // A category can't be its own parent, and can't be moved under one of its
  // own descendants (would create a cycle in the tree).
  function descendantIds(id: string): Set<string> {
    const ids = new Set<string>();
    const stack = [id];
    while (stack.length) {
      const current = stack.pop()!;
      for (const cat of categories) {
        if (cat.parentId === current && !ids.has(cat.id)) {
          ids.add(cat.id);
          stack.push(cat.id);
        }
      }
    }
    return ids;
  }

  const parentOptions = editingId
    ? categories.filter((c) => c.id !== editingId && !descendantIds(editingId).has(c.id))
    : categories;

  function categoryDepth(cat: Category): number {
    let depth = 0;
    let current = cat;
    while (current.parentId) {
      const parent = categories.find((c) => c.id === current.parentId);
      if (!parent) break;
      depth += 1;
      current = parent;
    }
    return depth;
  }

  const sortedCategories = useMemo(() => {
    const byParent = new Map<string | null, Category[]>();
    for (const cat of categories) {
      const key = cat.parentId ?? null;
      byParent.set(key, [...(byParent.get(key) ?? []), cat]);
    }
    const result: Category[] = [];
    function visit(parentId: string | null) {
      for (const cat of byParent.get(parentId) ?? []) {
        result.push(cat);
        visit(cat.id);
      }
    }
    visit(null);
    return result;
  }, [categories]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categorii</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categorii — apar în meniul principal, homepage și filtrele de
            produse.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă categorie
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Categorie</th>
              <th className="p-4 font-medium">Categorie părinte</th>
              <th className="p-4 font-medium">URL</th>
              <th className="p-4 font-medium">Produse</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedCategories.map((cat) => (
              <tr key={cat.id}>
                <td className="flex items-center gap-3 p-4">
                  <div
                    className="shrink-0"
                    style={{ width: categoryDepth(cat) * 24 }}
                    aria-hidden
                  />
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{cat.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">
                  {cat.parentId
                    ? categories.find((c) => c.id === cat.parentId)?.name ?? "—"
                    : "—"}
                </td>
                <td className="p-4 font-mono text-xs text-muted-foreground">
                  /categories/{cat.slug}
                </td>
                <td className="p-4 text-muted-foreground">{cat.productCount}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
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
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează categoria" : "Categorie nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="cat-name" className="mb-1.5">
                Nume categorie
              </Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, slug: slugEdited ? f.slug : slugify(name) }));
                }}
                placeholder="ex. Audio"
                required
              />
            </div>
            <div>
              <Label htmlFor="cat-slug" className="mb-1.5">
                URL (slug)
              </Label>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">/categories/</span>
                <Input
                  id="cat-slug"
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
              <Label className="mb-1.5">Categorie părinte</Label>
              <Select
                value={form.parentId ?? NO_PARENT}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, parentId: value === NO_PARENT ? null : value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Fără categorie părinte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PARENT}>Fără categorie părinte (categorie principală)</SelectItem>
                  {parentOptions.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                Alege o categorie părinte pentru a face din aceasta o subcategorie, vizibilă în
                meniu sub categoria principală.
              </p>
            </div>
            <div>
              <Label htmlFor="cat-description" className="mb-1.5">
                Descriere
              </Label>
              <Textarea
                id="cat-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="min-h-16"
              />
            </div>
            <div>
              <Label htmlFor="cat-image" className="mb-1.5">
                URL imagine
              </Label>
              <ImageUploadInput
                id="cat-image"
                value={form.image}
                onChange={(image) => setForm((f) => ({ ...f, image }))}
              />
            </div>
            <div>
              <Label htmlFor="cat-count" className="mb-1.5">
                Număr produse afișat
              </Label>
              <Input
                id="cat-count"
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
                {editingId ? "Salvează modificările" : "Adaugă categoria"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
