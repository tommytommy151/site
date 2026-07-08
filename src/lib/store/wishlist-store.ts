"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (id) =>
        set((state) => ({
          productIds: state.productIds.includes(id)
            ? state.productIds.filter((p) => p !== id)
            : [...state.productIds, id],
        })),
      has: (id) => get().productIds.includes(id),
      remove: (id) => set((state) => ({ productIds: state.productIds.filter((p) => p !== id) })),
    }),
    { name: "lucent-wishlist" },
  ),
);
