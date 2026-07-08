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
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,
      brands: DEFAULT_BRANDS,
      attributes: DEFAULT_ATTRIBUTES,

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: crypto.randomUUID() }],
        })),
      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...category } : c)),
        })),
      deleteCategory: (id) =>
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),

      addBrand: (brand) =>
        set((state) => ({ brands: [...state.brands, { ...brand, id: crypto.randomUUID() }] })),
      updateBrand: (id, brand) =>
        set((state) => ({
          brands: state.brands.map((b) => (b.id === id ? { ...b, ...brand } : b)),
        })),
      deleteBrand: (id) =>
        set((state) => ({ brands: state.brands.filter((b) => b.id !== id) })),

      addAttribute: (attribute) =>
        set((state) => ({
          attributes: [...state.attributes, { ...attribute, id: crypto.randomUUID() }],
        })),
      updateAttribute: (id, attribute) =>
        set((state) => ({
          attributes: state.attributes.map((a) => (a.id === id ? { ...a, ...attribute } : a)),
        })),
      deleteAttribute: (id) =>
        set((state) => ({ attributes: state.attributes.filter((a) => a.id !== id) })),
    }),
    { name: "estelaoferta-catalog" },
  ),
);
