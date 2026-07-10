"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductBadge } from "@/types/product";
import { products as DEFAULT_PRODUCTS } from "@/lib/data/products";

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
    rating: 0,
    reviewCount: 0,
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
    reviews: [],
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
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: DEFAULT_PRODUCTS,

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
    { name: "estelaoferta-products" },
  ),
);
