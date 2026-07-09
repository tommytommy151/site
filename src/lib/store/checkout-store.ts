"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShippingMethod } from "@/lib/pricing";
import type { OrderItem } from "@/types/order";

export interface CheckoutAddress {
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  county: string;
  postalCode: string;
}

const EMPTY_ADDRESS: CheckoutAddress = {
  fullName: "",
  phone: "",
  line1: "",
  city: "",
  county: "",
  postalCode: "",
};

interface CheckoutState {
  contactName: string;
  contactEmail: string;
  address: CheckoutAddress;
  shippingMethod: ShippingMethod["id"];
  pendingOrderId: string | null;
  pendingItems: OrderItem[];
  setContact: (name: string, email: string) => void;
  setAddress: (address: CheckoutAddress) => void;
  setShippingMethod: (method: ShippingMethod["id"]) => void;
  setPendingOrder: (id: string, items: OrderItem[]) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      contactName: "",
      contactEmail: "",
      address: EMPTY_ADDRESS,
      shippingMethod: "standard",
      pendingOrderId: null,
      pendingItems: [],

      setContact: (contactName, contactEmail) => set({ contactName, contactEmail }),
      setAddress: (address) => set({ address }),
      setShippingMethod: (shippingMethod) => set({ shippingMethod }),
      setPendingOrder: (pendingOrderId, pendingItems) => set({ pendingOrderId, pendingItems }),
      reset: () =>
        set({
          contactName: "",
          contactEmail: "",
          address: EMPTY_ADDRESS,
          shippingMethod: "standard",
          pendingOrderId: null,
          pendingItems: [],
        }),
    }),
    { name: "estelaoferta-checkout" },
  ),
);
