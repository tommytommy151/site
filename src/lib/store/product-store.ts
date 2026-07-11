"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductBadge } from "@/types/product";
import { products as DEFAULT_PRODUCTS } from "@/lib/data/products";
import { generateSmallReviewSet } from "@/lib/data/reviews";

export interface ProductFormInput {
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image: string;
  description: string;
  badges: ProductBadge[];
}

function buildProduct(id: string, input: ProductFormInput): Product {
  const image = input.image.trim() || `https://picsum.photos/seed/${id}/1200/1400`;
  const reviews = generateSmallReviewSet(id);
  const rating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;
  return {
    id,
    slug: input.slug,
    name: input.name,
    brand: input.brand,
    brandSlug: input.brandSlug,
    category: input.category,
    categorySlug: input.categorySlug,
    tagline: input.description.slice(0, 120),
    description: input.description,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    currency: "RON",
    rating,
    reviewCount: reviews.length,
    images: [image],
    variants: [
      {
        id: `${id}-default`,
        sku: `LC-${id.toUpperCase()}`,
        options: {},
        price: input.price,
        compareAtPrice: input.compareAtPrice,
        stock: input.stock,
      },
    ],
    badges: input.badges,
    stock: input.stock,
    sku: `LC-${id.toUpperCase()}`,
    features: [],
    reviews,
    relatedIds: [],
  };
}

function syncProduct(product: Product) {
  fetch("/api/products/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  }).catch(() => {});
}

function syncDeleteProduct(slug: string) {
  fetch("/api/products/sync", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug }),
  }).catch(() => {});
}

interface ProductState {
  products: Product[];
  addProduct: (input: ProductFormInput) => void;
  updateProduct: (id: string, input: ProductFormInput) => void;
  patchProduct: (id: string, patch: Partial<Pick<Product, "name" | "description">>) => void;
  deleteProduct: (id: string) => void;
  mergeCustomProducts: (products: Product[]) => void;
}

// Both prior storage keys turned out to hold stale/placeholder data rather
// than real product data (the old key predates the current seed data, and
// carrying it forward re-surfaced test products, not genuine imports).
// Drop them so every browser starts clean from the current seed data in
// src/lib/data/products.ts; legitimate custom products going forward are
// recovered via mergeCustomProducts + the Redis-backed /api/products sync.
const STORAGE_KEY = "estelaoferta-products-v3";
if (typeof window !== "undefined") {
  localStorage.removeItem("estelaoferta-products");
  localStorage.removeItem("estelaoferta-products-v2");
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: DEFAULT_PRODUCTS,

      mergeCustomProducts: (incoming) =>
        set((state) => {
          const existingSlugs = new Set(state.products.map((p) => p.slug));
          const toAdd = incoming.filter((p) => !existingSlugs.has(p.slug));
          return toAdd.length ? { products: [...toAdd, ...state.products] } : {};
        }),

      addProduct: (input) =>
        set((state) => {
          const id = crypto.randomUUID();
          const product = buildProduct(id, input);
          syncProduct(product);
          return { products: [product, ...state.products] };
        }),

      updateProduct: (id, input) =>
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const updated = {
              ...p,
              ...buildProduct(id, input),
              reviews: p.reviews,
              rating: p.rating,
              reviewCount: p.reviewCount,
            };
            syncProduct(updated);
            return updated;
          }),
        })),

      patchProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const updated = { ...p, ...patch };
            syncProduct(updated);
            return updated;
          }),
        })),

      deleteProduct: (id) =>
        set((state) => {
          const target = state.products.find((p) => p.id === id);
          if (target) syncDeleteProduct(target.slug);
          return { products: state.products.filter((p) => p.id !== id) };
        }),
    }),
    { name: STORAGE_KEY },
  ),
);
