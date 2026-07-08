"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

interface CompareState {
  productIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  isFull: () => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (id) =>
        set((state) => {
          if (state.productIds.includes(id)) {
            return { productIds: state.productIds.filter((p) => p !== id) };
          }
          if (state.productIds.length >= MAX_COMPARE) return state;
          return { productIds: [...state.productIds, id] };
        }),
      has: (id) => get().productIds.includes(id),
      remove: (id) => set((state) => ({ productIds: state.productIds.filter((p) => p !== id) })),
      clear: () => set({ productIds: [] }),
      isFull: () => get().productIds.length >= MAX_COMPARE,
    }),
    { name: "lucent-compare" },
  ),
);
