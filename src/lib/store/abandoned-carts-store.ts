"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AbandonedCart {
  id: string;
  email: string;
  items: string;
  value: number;
  abandonedAt: string;
}

const DEFAULT_ABANDONED_CARTS: AbandonedCart[] = [
  {
    id: "cart-ana-popescu",
    email: "ana.popescu@gmail.com",
    items: "Rochie de vară, Sandale piele",
    value: 429,
    abandonedAt: "2026-07-05T14:22:00.000Z",
  },
  {
    id: "cart-mihai-ionescu",
    email: "mihai.ionescu@yahoo.com",
    items: "Geacă de piele bărbați",
    value: 899,
    abandonedAt: "2026-07-06T09:10:00.000Z",
  },
  {
    id: "cart-elena-radu",
    email: "elena.radu@outlook.com",
    items: "Set cosmetice, Cremă hidratantă, Ser facial",
    value: 256,
    abandonedAt: "2026-07-06T20:45:00.000Z",
  },
  {
    id: "cart-george-stan",
    email: "george.stan@gmail.com",
    items: "Pantofi sport, Șosete sport (3 perechi)",
    value: 380,
    abandonedAt: "2026-07-07T11:05:00.000Z",
  },
];

interface AbandonedCartState {
  abandonedCarts: AbandonedCart[];
  deleteAbandonedCart: (id: string) => void;
}

export const useAbandonedCartStore = create<AbandonedCartState>()(
  persist(
    (set) => ({
      abandonedCarts: DEFAULT_ABANDONED_CARTS,

      deleteAbandonedCart: (id) =>
        set((state) => ({
          abandonedCarts: state.abandonedCarts.filter((c) => c.id !== id),
        })),
    }),
    { name: "estelaoferta-abandoned-carts" },
  ),
);
