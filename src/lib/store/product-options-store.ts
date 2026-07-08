"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductOption {
  id: string;
  name: string;
  extraPrice: number;
}

const DEFAULT_PRODUCT_OPTIONS: ProductOption[] = [
  { id: "opt-ambalaj-cadou", name: "Ambalaj cadou", extraPrice: 15 },
  { id: "opt-gravura", name: "Gravură personalizată", extraPrice: 35 },
  { id: "opt-garantie-extinsa", name: "Garanție extinsă 2 ani", extraPrice: 89 },
];

interface ProductOptionState {
  productOptions: ProductOption[];
  addProductOption: (option: Omit<ProductOption, "id">) => void;
  updateProductOption: (id: string, option: Omit<ProductOption, "id">) => void;
  deleteProductOption: (id: string) => void;
}

export const useProductOptionStore = create<ProductOptionState>()(
  persist(
    (set) => ({
      productOptions: DEFAULT_PRODUCT_OPTIONS,

      addProductOption: (option) =>
        set((state) => ({
          productOptions: [...state.productOptions, { ...option, id: crypto.randomUUID() }],
        })),

      updateProductOption: (id, option) =>
        set((state) => ({
          productOptions: state.productOptions.map((o) => (o.id === id ? { ...o, ...option } : o)),
        })),

      deleteProductOption: (id) =>
        set((state) => ({ productOptions: state.productOptions.filter((o) => o.id !== id) })),
    }),
    { name: "estelaoferta-product-options" },
  ),
);
