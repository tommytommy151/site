"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "@/types/product";

export interface CartLine {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  options: Record<string, string>;
  quantity: number;
  maxStock: number;
}

interface CartState {
  lines: CartLine[];
  savedForLater: CartLine[];
  isOpen: boolean;
  couponCode: string | null;
  couponDiscountPct: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  saveForLater: (variantId: string) => void;
  moveToCart: (variantId: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

const VALID_COUPONS: Record<string, number> = {
  WELCOME10: 10,
  LUCENT15: 15,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      savedForLater: [],
      isOpen: false,
      couponCode: null,
      couponDiscountPct: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existing = state.lines.find((l) => l.variantId === variant.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.variantId === variant.id
                  ? { ...l, quantity: Math.min(l.quantity + quantity, variant.stock) }
                  : l,
              ),
              isOpen: true,
            };
          }
          const line: CartLine = {
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0],
            brand: product.brand,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            options: variant.options,
            quantity: Math.min(quantity, variant.stock),
            maxStock: variant.stock,
          };
          return { lines: [...state.lines, line], isOpen: true };
        });
      },

      removeItem: (variantId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.variantId !== variantId) })),

      setQuantity: (variantId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.variantId === variantId
              ? { ...l, quantity: Math.max(1, Math.min(quantity, l.maxStock)) }
              : l,
          ),
        })),

      saveForLater: (variantId) =>
        set((state) => {
          const line = state.lines.find((l) => l.variantId === variantId);
          if (!line) return state;
          return {
            lines: state.lines.filter((l) => l.variantId !== variantId),
            savedForLater: [...state.savedForLater, line],
          };
        }),

      moveToCart: (variantId) =>
        set((state) => {
          const line = state.savedForLater.find((l) => l.variantId === variantId);
          if (!line) return state;
          return {
            savedForLater: state.savedForLater.filter((l) => l.variantId !== variantId),
            lines: [...state.lines, line],
          };
        }),

      applyCoupon: (code) => {
        const pct = VALID_COUPONS[code.trim().toUpperCase()];
        if (!pct) return false;
        set({ couponCode: code.trim().toUpperCase(), couponDiscountPct: pct });
        return true;
      },

      removeCoupon: () => set({ couponCode: null, couponDiscountPct: 0 }),

      clearCart: () => set({ lines: [], couponCode: null, couponDiscountPct: 0 }),

      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),

      itemCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    {
      name: "lucent-cart",
      partialize: (state) => ({
        lines: state.lines,
        savedForLater: state.savedForLater,
        couponCode: state.couponCode,
        couponDiscountPct: state.couponDiscountPct,
      }),
    },
  ),
);
