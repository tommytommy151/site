"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 12;

interface RecentlyViewedState {
  productIds: string[];
  add: (id: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      productIds: [],
      add: (id) =>
        set((state) => ({
          productIds: [id, ...state.productIds.filter((p) => p !== id)].slice(0, MAX_RECENT),
        })),
    }),
    { name: "lucent-recently-viewed" },
  ),
);
