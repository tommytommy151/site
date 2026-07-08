"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@/types/auth";

interface AccountState {
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const SEED_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Acasă",
    fullName: "Ioana Petrescu",
    phone: "+40 722 123 456",
    line1: "Str. Aviatorilor 23, Bl. 4, Ap. 12",
    city: "București",
    county: "Sector 1",
    postalCode: "011853",
    isDefault: true,
  },
];

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      addresses: SEED_ADDRESSES,

      addAddress: (address) =>
        set((state) => ({
          addresses: [
            ...state.addresses,
            { ...address, id: `addr-${Date.now()}` },
          ],
        })),

      removeAddress: (id) =>
        set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),

      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),
    }),
    { name: "estelaoferta-account" },
  ),
);
