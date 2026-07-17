"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductCard } from "@/components/product/product-card";
import { RatingStars } from "@/components/ui/rating-stars";
import { useProductStore } from "@/lib/store/product-store";
import { useCatalogStore } from "@/lib/store/catalog-store";
import { productCategorySlugs } from "@/lib/products/category-slugs";
import { formatPrice } from "@/lib/format";
import type { Product, ProductBadge } from "@/types/product";

const MAX_PRICE = 4000;

type SortKey = "featured" | "new" | "bestseller" | "trending" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Recomandate" },
  { value: "new", label: "Cele mai noi" },
  { value: "bestseller", label: "Cele mai vândute" },
  { value: "trending", label: "În tendințe" },
  { value: "price-asc", label: "Preț: crescător" },
  { value: "price-desc", label: "Preț: descrescător" },
  { value: "rating", label: "Cel mai bine cotate" },
];

const BADGE_FILTER_LABELS: Record<ProductBadge, string> = {
  new: "Nou",
  bestseller: "Cel mai vândut",
  "flash-deal": "Reducere",
  "sold-out": "Stoc epuizat",
  limited: "Ediție limitată",
};

function sortProducts(products: Product[], sort: SortKey) {
  const list = [...products];
  switch (sort) {
    case "new":
      return list.filter((p) => p.badges.includes("new")).concat(list.filter((p) => !p.badges.includes("new")));
    case "bestseller":
      return list.sort((a, b) => b.reviewCount - a.reviewCount);
    case "trending":
      return list.sort((a, b) => b.rating - a.rating);
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    default:
      return list;
  }
}

interface Filters {
  categories: string[];
  brands: string[];
  priceMax: number;
  minRating: number;
  inStockOnly: boolean;
  badges: ProductBadge[];
}

const DEFAULT_FILTERS: Filters = {
  categories: [],
  brands: [],
  priceMax: MAX_PRICE,
  minRating: 0,
  inStockOnly: false,
  badges: [],
};

export function ProductListing({ initialCategorySlug }: { initialCategorySlug?: string } = {}) {
  const allProducts = useProductStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const brands = useCatalogStore((s) => s.brands);
  const searchParams = useSearchParams();
  const initialSort = (searchParams.get("sort") as SortKey) || "featured";
  const initialCategory = initialCategorySlug ?? searchParams.get("category");

  const [filters, setFilters] = useState<Filters>(() => {
    if (!initialCategory) return DEFAULT_FILTERS;
    const match = categories.find((c) => c.slug === initialCategory);
    const childSlugs = match
      ? categories.filter((c) => c.parentId === match.id).map((c) => c.slug)
      : [];
    return { ...DEFAULT_FILTERS, categories: [initialCategory, ...childSlugs] };
  });
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (filters.categories.length && !productCategorySlugs(p).some((slug) => filters.categories.includes(slug)))
        return false;
      if (filters.brands.length && !filters.brands.includes(p.brandSlug)) return false;
      if (p.price > filters.priceMax) return false;
      if (p.rating < filters.minRating) return false;
      if (filters.inStockOnly && p.stock === 0) return false;
      if (filters.badges.length && !filters.badges.some((b) => p.badges.includes(b))) return false;
      return true;
    });
    list = sortProducts(list, sort);
    return list;
  }, [filters, sort]);

  function toggleArrayFilter<K extends "categories" | "brands">(key: K, value: string) {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  }

  function toggleBadge(badge: ProductBadge) {
    setFilters((f) => ({
      ...f,
      badges: f.badges.includes(badge) ? f.badges.filter((b) => b !== badge) : [...f.badges, badge],
    }));
  }

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    filters.badges.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceMax < MAX_PRICE ? 1 : 0);

  const filterPanel = (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Categorie</p>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={filters.categories.includes(cat.slug)}
                onCheckedChange={() => toggleArrayFilter("categories", cat.slug)}
              />
              <span className="relative size-4 shrink-0 overflow-hidden rounded-full bg-muted">
                {cat.image && (
                  <Image src={cat.image} alt="" fill sizes="16px" className="object-cover" unoptimized />
                )}
              </span>
              <span className="text-foreground/85">{cat.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{cat.productCount}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Brand</p>
        <div className="flex flex-col gap-2.5">
          {brands.map((brand) => (
            <label key={brand.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={filters.brands.includes(brand.slug)}
                onCheckedChange={() => toggleArrayFilter("brands", brand.slug)}
              />
              <span className="text-foreground/85">{brand.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{brand.productCount}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Preț</p>
        <Slider
          value={[filters.priceMax]}
          max={MAX_PRICE}
          step={50}
          onValueChange={([v]) => setFilters((f) => ({ ...f, priceMax: v }))}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(filters.priceMax)}</span>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Evaluare</p>
        <div className="flex flex-col gap-2.5">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                filters.minRating === r ? "bg-brand-emerald-soft text-brand-emerald" : "hover:bg-muted"
              }`}
            >
              <RatingStars rating={r} size={13} />
              <span>și peste</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Disponibilitate</p>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox
            checked={filters.inStockOnly}
            onCheckedChange={(v) => setFilters((f) => ({ ...f, inStockOnly: Boolean(v) }))}
          />
          <span className="text-foreground/85">Doar produse în stoc</span>
        </label>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Repere</p>
        <div className="flex flex-wrap gap-2">
          {(["new", "bestseller", "flash-deal", "limited"] as ProductBadge[]).map((b) => (
            <button
              key={b}
              onClick={() => toggleBadge(b)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.badges.includes(b)
                  ? "border-brand-emerald bg-brand-emerald-soft text-brand-emerald"
                  : "border-border text-foreground/70 hover:border-foreground/30"
              }`}
            >
              {BADGE_FILTER_LABELS[b]}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
          Șterge toate filtrele
        </Button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">{filterPanel}</aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "produs" : "produse"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="size-3.5" />
              Filtre
              {activeFilterCount > 0 && (
                <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-brand-emerald text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger size="sm" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
            <p className="text-sm font-medium text-foreground">
              Niciun produs nu corespunde filtrelor tale
            </p>
            <Button variant="outline" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
              Șterge filtrele
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-[85%] max-w-sm gap-0 overflow-y-auto p-0">
          <SheetHeader className="flex-row items-center justify-between border-b border-border px-5 py-4">
            <SheetTitle>Filtre</SheetTitle>
          </SheetHeader>
          <div className="p-5">{filterPanel}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
