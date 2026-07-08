"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Coupon {
  id: string;
  code: string;
  discountPct: number;
  active: boolean;
}

const DEFAULT_COUPONS: Coupon[] = [
  { id: "coupon-welcome10", code: "WELCOME10", discountPct: 10, active: true },
  { id: "coupon-lucent15", code: "LUCENT15", discountPct: 15, active: true },
];

interface CouponState {
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, "id">) => void;
  updateCoupon: (id: string, coupon: Omit<Coupon, "id">) => void;
  deleteCoupon: (id: string) => void;
  findActiveCoupon: (code: string) => Coupon | undefined;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: DEFAULT_COUPONS,

      addCoupon: (coupon) =>
        set((state) => ({
          coupons: [...state.coupons, { ...coupon, id: crypto.randomUUID() }],
        })),

      updateCoupon: (id, coupon) =>
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...coupon } : c)),
        })),

      deleteCoupon: (id) =>
        set((state) => ({ coupons: state.coupons.filter((c) => c.id !== id) })),

      findActiveCoupon: (code) =>
        get().coupons.find(
          (c) => c.active && c.code.toUpperCase() === code.trim().toUpperCase(),
        ),
    }),
    { name: "estelaoferta-coupons" },
  ),
);
