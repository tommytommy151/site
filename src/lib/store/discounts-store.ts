"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DiscountType = "percent" | "fixed";

export interface Discount {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  appliesTo: string;
}

const DEFAULT_DISCOUNTS: Discount[] = [
  {
    id: "discount-ingrijire",
    name: "Reducere îngrijire ten",
    type: "percent",
    value: 15,
    appliesTo: "Categoria Îngrijire ten",
  },
  {
    id: "discount-livrare",
    name: "Reducere fixă la livrare",
    type: "fixed",
    value: 20,
    appliesTo: "Comenzi peste 200 lei",
  },
  {
    id: "discount-parfumuri",
    name: "Reducere parfumuri de sezon",
    type: "percent",
    value: 10,
    appliesTo: "Categoria Parfumuri",
  },
];

interface DiscountState {
  discounts: Discount[];
  addDiscount: (discount: Omit<Discount, "id">) => void;
  updateDiscount: (id: string, discount: Omit<Discount, "id">) => void;
  deleteDiscount: (id: string) => void;
}

export const useDiscountStore = create<DiscountState>()(
  persist(
    (set) => ({
      discounts: DEFAULT_DISCOUNTS,

      addDiscount: (discount) =>
        set((state) => ({
          discounts: [...state.discounts, { ...discount, id: crypto.randomUUID() }],
        })),

      updateDiscount: (id, discount) =>
        set((state) => ({
          discounts: state.discounts.map((d) => (d.id === id ? { ...d, ...discount } : d)),
        })),

      deleteDiscount: (id) =>
        set((state) => ({ discounts: state.discounts.filter((d) => d.id !== id) })),
    }),
    { name: "estelaoferta-discounts" },
  ),
);
