"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomerGroup {
  id: string;
  name: string;
  discountPct: number;
  description: string;
}

const DEFAULT_CUSTOMER_GROUPS: CustomerGroup[] = [
  {
    id: "group-vip",
    name: "Clienți VIP",
    discountPct: 15,
    description: "Clienți cu peste 10 comenzi finalizate sau valoare totală peste 5000 lei.",
  },
  {
    id: "group-wholesale",
    name: "Parteneri en-gros",
    discountPct: 25,
    description: "Comercianți și revânzători cu contract de colaborare activ.",
  },
  {
    id: "group-newsletter",
    name: "Abonați newsletter",
    discountPct: 5,
    description: "Clienți abonați la newsletter, primesc reducere permanentă mică.",
  },
];

interface CustomerGroupState {
  customerGroups: CustomerGroup[];
  addCustomerGroup: (group: Omit<CustomerGroup, "id">) => void;
  updateCustomerGroup: (id: string, group: Omit<CustomerGroup, "id">) => void;
  deleteCustomerGroup: (id: string) => void;
}

export const useCustomerGroupStore = create<CustomerGroupState>()(
  persist(
    (set) => ({
      customerGroups: DEFAULT_CUSTOMER_GROUPS,

      addCustomerGroup: (group) =>
        set((state) => ({
          customerGroups: [
            ...state.customerGroups,
            { ...group, id: crypto.randomUUID() },
          ],
        })),

      updateCustomerGroup: (id, group) =>
        set((state) => ({
          customerGroups: state.customerGroups.map((g) =>
            g.id === id ? { ...g, ...group } : g,
          ),
        })),

      deleteCustomerGroup: (id) =>
        set((state) => ({
          customerGroups: state.customerGroups.filter((g) => g.id !== id),
        })),
    }),
    { name: "estelaoferta-customer-groups" },
  ),
);
