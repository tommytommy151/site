"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

const DEFAULT_SHIPPING_METHODS: ShippingMethod[] = [
  { id: "ship-curier", name: "Curier rapid (24-48h)", price: 19.9, active: true },
  { id: "ship-posta", name: "Poșta Română (3-5 zile)", price: 12.5, active: true },
  { id: "ship-locker", name: "Easybox / locker", price: 9.9, active: true },
  { id: "ship-ridicare", name: "Ridicare din showroom", price: 0, active: false },
];

interface ShippingMethodState {
  shippingMethods: ShippingMethod[];
  addShippingMethod: (method: Omit<ShippingMethod, "id">) => void;
  updateShippingMethod: (id: string, method: Omit<ShippingMethod, "id">) => void;
  deleteShippingMethod: (id: string) => void;
}

export const useShippingMethodStore = create<ShippingMethodState>()(
  persist(
    (set) => ({
      shippingMethods: DEFAULT_SHIPPING_METHODS,

      addShippingMethod: (method) =>
        set((state) => ({
          shippingMethods: [...state.shippingMethods, { ...method, id: crypto.randomUUID() }],
        })),

      updateShippingMethod: (id, method) =>
        set((state) => ({
          shippingMethods: state.shippingMethods.map((m) =>
            m.id === id ? { ...m, ...method } : m,
          ),
        })),

      deleteShippingMethod: (id) =>
        set((state) => ({
          shippingMethods: state.shippingMethods.filter((m) => m.id !== id),
        })),
    }),
    { name: "estelaoferta-shipping-methods" },
  ),
);
