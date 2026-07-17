"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Attribute, Brand, Category } from "@/types/product";
import { categories as DEFAULT_CATEGORIES, brands as DEFAULT_BRANDS } from "@/lib/data/categories";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DEFAULT_ATTRIBUTES: Attribute[] = [
  { id: "attr-culoare", name: "Culoare", values: ["Negru", "Alb", "Bej", "Verde", "Albastru"] },
  { id: "attr-marime", name: "Mărime", values: ["XS", "S", "M", "L", "XL"] },
];

function syncCatalog(snapshot: { categories: Category[]; brands: Brand[]; attributes: Attribute[] }) {
  fetch("/api/catalog/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snapshot),
  }).catch(() => {});
}

interface CatalogState {
  categories: Category[];
  brands: Brand[];
  attributes: Attribute[];

  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Omit<Category, "id">) => void;
  deleteCategory: (id: string) => void;

  addBrand: (brand: Omit<Brand, "id">) => void;
  updateBrand: (id: string, brand: Omit<Brand, "id">) => void;
  deleteBrand: (id: string) => void;

  addAttribute: (attribute: Omit<Attribute, "id">) => void;
  updateAttribute: (id: string, attribute: Omit<Attribute, "id">) => void;
  deleteAttribute: (id: string) => void;

  mergeServerCatalog: (snapshot: { categories: Category[]; brands: Brand[]; attributes: Attribute[] }) => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,
      brands: DEFAULT_BRANDS,
      attributes: DEFAULT_ATTRIBUTES,

      addCategory: (category) => {
        const categories = [...get().categories, { ...category, id: crypto.randomUUID() }];
        syncCatalog({ ...get(), categories });
        set({ categories });
      },
      updateCategory: (id, category) => {
        const categories = get().categories.map((c) => (c.id === id ? { ...c, ...category } : c));
        syncCatalog({ ...get(), categories });
        set({ categories });
      },
      deleteCategory: (id) => {
        const categories = get().categories.filter((c) => c.id !== id);
        syncCatalog({ ...get(), categories });
        set({ categories });
      },

      addBrand: (brand) => {
        const brands = [...get().brands, { ...brand, id: crypto.randomUUID() }];
        syncCatalog({ ...get(), brands });
        set({ brands });
      },
      updateBrand: (id, brand) => {
        const brands = get().brands.map((b) => (b.id === id ? { ...b, ...brand } : b));
        syncCatalog({ ...get(), brands });
        set({ brands });
      },
      deleteBrand: (id) => {
        const brands = get().brands.filter((b) => b.id !== id);
        syncCatalog({ ...get(), brands });
        set({ brands });
      },

      addAttribute: (attribute) => {
        const attributes = [...get().attributes, { ...attribute, id: crypto.randomUUID() }];
        syncCatalog({ ...get(), attributes });
        set({ attributes });
      },
      updateAttribute: (id, attribute) => {
        const attributes = get().attributes.map((a) => (a.id === id ? { ...a, ...attribute } : a));
        syncCatalog({ ...get(), attributes });
        set({ attributes });
      },
      deleteAttribute: (id) => {
        const attributes = get().attributes.filter((a) => a.id !== id);
        syncCatalog({ ...get(), attributes });
        set({ attributes });
      },

      // Another device may have added/edited categories, brands, or
      // attributes — upsert their synced state in by id without dropping
      // anything only known locally (e.g. not yet synced, or a code default).
      mergeServerCatalog: (snapshot) =>
        set((state) => {
          function upsertById<T extends { id: string }>(local: T[], incoming: T[]): T[] {
            const incomingById = new Map(incoming.map((item) => [item.id, item]));
            const merged = local.map((item) => incomingById.get(item.id) ?? item);
            const localIds = new Set(local.map((item) => item.id));
            const toAdd = incoming.filter((item) => !localIds.has(item.id));
            return [...merged, ...toAdd];
          }
          return {
            categories: upsertById(state.categories, snapshot.categories),
            brands: upsertById(state.brands, snapshot.brands),
            attributes: upsertById(state.attributes, snapshot.attributes),
          };
        }),
    }),
    {
      name: "estelaoferta-catalog",
      // Browsers that already persisted a catalog before a new default
      // category/brand/attribute was added in code would otherwise never see
      // it, since the saved array fully overrides the defaults on rehydrate.
      // Keep everything the admin saved locally and layer in any default
      // entries that are still missing by id.
      merge: (persisted, current) => {
        const saved = persisted as Partial<CatalogState>;
        function mergeById<T extends { id: string }>(defaults: T[], savedList?: T[]): T[] {
          if (!savedList) return defaults;
          const savedIds = new Set(savedList.map((item) => item.id));
          return [...savedList, ...defaults.filter((item) => !savedIds.has(item.id))];
        }
        return {
          ...current,
          ...saved,
          categories: mergeById(DEFAULT_CATEGORIES, saved.categories),
          brands: mergeById(DEFAULT_BRANDS, saved.brands),
          attributes: mergeById(DEFAULT_ATTRIBUTES, saved.attributes),
        };
      },
    },
  ),
);
