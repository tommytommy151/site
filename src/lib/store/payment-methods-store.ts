"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PaymentMethod {
  id: string;
  name: string;
  provider: string;
  enabled: boolean;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pay-card", name: "Card bancar online", provider: "Stripe", enabled: true },
  { id: "pay-ramburs", name: "Plată ramburs", provider: "Curier propriu", enabled: true },
  { id: "pay-transfer", name: "Transfer bancar", provider: "Banca Transilvania", enabled: false },
  { id: "pay-paypal", name: "PayPal", provider: "PayPal", enabled: false },
];

interface PaymentMethodState {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
  updatePaymentMethod: (id: string, method: Omit<PaymentMethod, "id">) => void;
  deletePaymentMethod: (id: string) => void;
}

export const usePaymentMethodStore = create<PaymentMethodState>()(
  persist(
    (set) => ({
      paymentMethods: DEFAULT_PAYMENT_METHODS,

      addPaymentMethod: (method) =>
        set((state) => ({
          paymentMethods: [
            ...state.paymentMethods,
            { ...method, id: crypto.randomUUID() },
          ],
        })),

      updatePaymentMethod: (id, method) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map((m) =>
            m.id === id ? { ...m, ...method } : m,
          ),
        })),

      deletePaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((m) => m.id !== id),
        })),
    }),
    { name: "estelaoferta-payment-methods" },
  ),
);
