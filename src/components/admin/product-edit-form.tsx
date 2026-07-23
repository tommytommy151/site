"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Star, Trash2, X } from "lucide-react";
import { TagInput } from "@/components/admin/tag-input";
import { useProductStore, type ProductFormInput } from "@/lib/store/product-store";
import { useCatalogStore, slugify } from "@/lib/store/catalog-store";
import type { Product, ProductBadge } from "@/types/product";
import { productCategorySlugs } from "@/lib/products/category-slugs";
import { flattenCategoryTree, pickPrimaryCategory } from "@/lib/products/category-tree";
import { Input } from "@/components/ui/input";
import { ImageUploadInput } from "@/components/admin/image-upload-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BADGE_LABELS: Record<ProductBadge, string> = {
  new: "Nou",
  bestseller: "Cel mai vândut",
  "flash-deal": "Reducere",
  "sold-out": "Stoc epuizat",
  limited: "Ediție limitată",
};

function emptyForm(): ProductFormInput {
  return {
    name: "",
    slug: "",
    brand: "",
    brandSlug: "",
    category: "",
    categorySlug: "",
    categorySlugs: [],
    price: 0,
    compareAtPrice: undefined,
    stock: 0,
    image: "",
    images: [],
    description: "",
    badges: [],
    tags: [],
    boughtTogetherIds: [],
  };
}

function formFromProduct(product: Product): ProductFormInput {
  return {
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    brandSlug: product.brandSlug,
    category: product.category,
    categorySlug: product.categorySlug,
    categorySlugs: productCategorySlugs(product),
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.stock,
    image: product.images[0] ?? "",
    images: product.images,
    description: product.description,
    badges: product.badges,
    tags: product.tags ?? [],
    boughtTogetherIds: product.boughtTogetherIds ?? [],
  };
}

function SidebarBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</p>
      {children}
    </div>
  );
}

export function ProductEditForm({ product }: { product?: Product }) {
  const router = useRouter();
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const allProducts = useProductStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const brands = useCatalogStore((s) => s.brands);

  const [form, setForm] = useState<ProductFormInput>(() =>
    product ? formFromProduct(product) : emptyForm(),
  );
  const [error, setError] = useState<string | null>(null);
  const [boughtTogetherSearch, setBoughtTogetherSearch] = useState("");

  const gallery = form.images ?? [];
  const categoryTree = flattenCategoryTree(categories);

  const boughtTogetherIds = form.boughtTogetherIds ?? [];
  const boughtTogetherCandidates = allProducts
    .filter((p) => p.id !== product?.id)
    .filter((p) => p.name.toLowerCase().includes(boughtTogetherSearch.trim().toLowerCase()));
  const selectedBoughtTogether = allProducts.filter((p) => boughtTogetherIds.includes(p.id));

  function toggleBoughtTogether(id: string) {
    setForm((f) => {
      const current = f.boughtTogetherIds ?? [];
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      return { ...f, boughtTogetherIds: next };
    });
  }

  function toggleCategory(slug: string) {
    setForm((f) => {
      const current = f.categorySlugs ?? [];
      const nextSlugs = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
      const primary = pickPrimaryCategory(categoryTree, nextSlugs);
      return {
        ...f,
        categorySlugs: nextSlugs,
        category: primary?.name ?? "",
        categorySlug: primary?.slug ?? "",
      };
    });
  }

  function updateGalleryImage(index: number, url: string) {
    setForm((f) => {
      const next = [...(f.images ?? [])];
      next[index] = url;
      return { ...f, images: next, image: index === 0 ? url : f.image };
    });
  }

  function removeGalleryImage(index: number) {
    setForm((f) => {
      const next = (f.images ?? []).filter((_, i) => i !== index);
      return { ...f, images: next, image: next[0] ?? "" };
    });
  }

  function setMainImage(index: number) {
    setForm((f) => {
      const current = f.images ?? [];
      if (index <= 0 || index >= current.length) return f;
      const chosen = current[index];
      const rest = current.filter((_, i) => i !== index);
      const next = [chosen, ...rest];
      return { ...f, images: next, image: chosen };
    });
  }

  function addGalleryImage() {
    setForm((f) => ({ ...f, images: [...(f.images ?? []), ""] }));
  }

  function toggleBadge(badge: ProductBadge) {
    setForm((f) => ({
      ...f,
      badges: f.badges.includes(badge) ? f.badges.filter((b) => b !== badge) : [...f.badges, badge],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Numele produsului este obligatoriu.");
    if (!form.brand) return setError("Alege un brand.");
    if (!form.categorySlugs?.length) return setError("Alege cel puțin o categorie.");
    setError(null);

    const payload: ProductFormInput = {
      ...form,
      slug: form.slug || slugify(form.name),
      images: gallery.filter(Boolean),
    };

    if (product) {
      updateProduct(product.id, payload);
    } else {
      addProduct(payload);
    }
    router.push("/admin/products");
  }

  function handleDelete() {
    if (!product) return;
    deleteProduct(product.id);
    router.push("/admin/products");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {product ? "Editează produsul" : "Produs nou"}
          </h1>
        </div>
        {product && (
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            Vezi produsul <ExternalLink className="size-3.5" />
          </Link>
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Label htmlFor="p-name" className="mb-1.5">
              Titlu produs
            </Label>
            <Input
              id="p-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="ex. Robot de Bucătărie MultiChef 900"
              className="h-12 text-lg font-medium"
              required
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <Label htmlFor="p-description" className="mb-1.5">
              Descriere
            </Label>
            <Textarea
              id="p-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="min-h-72"
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-3 text-sm font-medium text-foreground">Imagini produs</p>
            {gallery.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {gallery.map((src, index) => (
                  <div key={index} className="flex flex-col gap-1.5">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                      {src ? (
                        <Image src={src} alt="" fill sizes="120px" className="object-cover" unoptimized />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        aria-label="Elimină imaginea"
                        className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                      {index !== 0 && src && (
                        <button
                          type="button"
                          onClick={() => setMainImage(index)}
                          aria-label="Fă imagine principală"
                          title="Fă imagine principală"
                          className="absolute bottom-1 left-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground"
                        >
                          <Star className="size-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="text-center text-[11px] text-muted-foreground">
                      {index === 0 ? "Principală" : " "}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <ImageUploadInput
                id="p-image-add"
                value=""
                onChange={(url) => setForm((f) => ({ ...f, images: [...(f.images ?? []), url] }))}
                placeholder="Adaugă un URL de imagine sau încarcă un fișier"
              />
              {gallery.map((src, index) =>
                src ? null : (
                  <ImageUploadInput
                    key={index}
                    id={`p-image-${index}`}
                    value={src}
                    onChange={(url) => updateGalleryImage(index, url)}
                  />
                ),
              )}
              <Button type="button" variant="outline" size="sm" onClick={addGalleryImage} className="self-start">
                + Adaugă altă imagine
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <SidebarBox title="Publicare">
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                {product ? "Salvează modificările" : "Publică produsul"}
              </Button>
              <Button type="button" variant="outline" className="w-full" asChild>
                <Link href="/admin/products">Anulează</Link>
              </Button>
              {product && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="size-4" />
                  Șterge produsul
                </Button>
              )}
            </div>
          </SidebarBox>

          <SidebarBox title="Organizare">
            <div className="flex flex-col gap-3">
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
                <Label className="mb-1.5">
                  Categorii{" "}
                  <span className="font-normal text-muted-foreground">
                    (poți bifa mai multe — categorie părinte, categorie și subcategorie)
                  </span>
                </Label>
                <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto rounded-lg border border-border p-2">
                  {categoryTree.map(({ category, depth }) => (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-muted"
                      style={{ paddingLeft: `${depth * 16 + 6}px` }}
                    >
                      <Checkbox
                        checked={(form.categorySlugs ?? []).includes(category.slug)}
                        onCheckedChange={() => toggleCategory(category.slug)}
                      />
                      <span className="text-foreground/85">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SidebarBox>

          <SidebarBox title="Preț & stoc">
            <div className="flex flex-col gap-3">
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
                <Label htmlFor="p-compare" className="mb-1.5">
                  Preț înainte de reducere (opțional)
                </Label>
                <Input
                  id="p-compare"
                  type="number"
                  min={0}
                  value={form.compareAtPrice ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      compareAtPrice: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
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
          </SidebarBox>

          <SidebarBox title="Repere">
            <div className="flex flex-col gap-2">
              {(Object.keys(BADGE_LABELS) as ProductBadge[]).map((badge) => (
                <label key={badge} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={form.badges.includes(badge)}
                    onCheckedChange={() => toggleBadge(badge)}
                  />
                  <span className="text-foreground/85">{BADGE_LABELS[badge]}</span>
                </label>
              ))}
            </div>
          </SidebarBox>

          <SidebarBox title="Etichete">
            <TagInput
              value={form.tags ?? []}
              onChange={(tags) => setForm((f) => ({ ...f, tags }))}
              placeholder="Scrie o etichetă și apasă Enter"
            />
          </SidebarBox>

          <SidebarBox title="Cumpărate frecvent împreună">
            <div className="flex flex-col gap-2">
              {selectedBoughtTogether.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedBoughtTogether.map((p) => (
                    <span
                      key={p.id}
                      className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground/85"
                    >
                      {p.name}
                      <button
                        type="button"
                        onClick={() => toggleBoughtTogether(p.id)}
                        aria-label={`Elimină ${p.name}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <Input
                value={boughtTogetherSearch}
                onChange={(e) => setBoughtTogetherSearch(e.target.value)}
                placeholder="Caută un produs după nume..."
              />
              <div className="flex max-h-52 flex-col gap-0.5 overflow-y-auto rounded-lg border border-border p-2">
                {boughtTogetherCandidates.length === 0 && (
                  <p className="px-1.5 py-1 text-sm text-muted-foreground">Niciun produs găsit.</p>
                )}
                {boughtTogetherCandidates.slice(0, 30).map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-muted"
                  >
                    <Checkbox
                      checked={boughtTogetherIds.includes(p.id)}
                      onCheckedChange={() => toggleBoughtTogether(p.id)}
                    />
                    <span className="text-foreground/85">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </SidebarBox>
        </div>
      </div>
    </form>
  );
}
