"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistOverview {
  id: string;
  customerName: string;
  products: string;
  updatedAt: string;
}

const DEFAULT_WISHLISTS: WishlistOverview[] = [
  {
    id: "wishlist-1",
    customerName: "Ioana Marinescu",
    products: "Cremă hidratantă cu acid hialuronic, Ser cu vitamina C",
    updatedAt: "2026-07-02",
  },
  {
    id: "wishlist-2",
    customerName: "Andrei Pop",
    products: "Parfum floral de damă, Loțiune de corp cu unt de shea",
    updatedAt: "2026-06-28",
  },
  {
    id: "wishlist-3",
    customerName: "Cristina Dumitrescu",
    products: "Mască de argilă pentru ten gras",
    updatedAt: "2026-06-20",
  },
  {
    id: "wishlist-4",
    customerName: "Mihai Constantin",
    products: "Set îngrijire bărbierit, Cremă de mâini cu unt de karité",
    updatedAt: "2026-07-05",
  },
];

interface WishlistOverviewState {
  wishlists: WishlistOverview[];
  deleteWishlist: (id: string) => void;
}

export const useWishlistOverviewStore = create<WishlistOverviewState>()(
  persist(
    (set) => ({
      wishlists: DEFAULT_WISHLISTS,

      deleteWishlist: (id) =>
        set((state) => ({ wishlists: state.wishlists.filter((w) => w.id !== id) })),
    }),
    { name: "estelaoferta-wishlists-overview" },
  ),
);
