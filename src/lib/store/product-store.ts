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

interface ProductState {
  products: Product[];
  addProduct: (input: ProductFormInput) => void;
  updateProduct: (id: string, input: ProductFormInput) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: DEFAULT_PRODUCTS,

      addProduct: (input) =>
        set((state) => {
          const id = crypto.randomUUID();
          return { products: [buildProduct(id, input), ...state.products] };
        }),

      updateProduct: (id, input) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...buildProduct(id, input), reviews: p.reviews, rating: p.rating, reviewCount: p.reviewCount } : p,
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
    }),
    { name: "estelaoferta-products" },
  ),
);
