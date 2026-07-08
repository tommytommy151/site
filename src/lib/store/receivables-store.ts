"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Receivable {
  id: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: "unpaid" | "paid";
}

const DEFAULT_RECEIVABLES: Receivable[] = [
  {
    id: "receivable-popescu",
    customerName: "Ana Popescu",
    amount: 450,
    dueDate: "2026-07-15",
    status: "unpaid",
  },
  {
    id: "receivable-ionescu-srl",
    customerName: "Ionescu Trade SRL",
    amount: 3200,
    dueDate: "2026-07-20",
    status: "unpaid",
  },
  {
    id: "receivable-radu",
    customerName: "Elena Radu",
    amount: 189,
    dueDate: "2026-06-30",
    status: "paid",
  },
];

interface ReceivableState {
  receivables: Receivable[];
  addReceivable: (receivable: Omit<Receivable, "id">) => void;
  updateReceivable: (id: string, receivable: Omit<Receivable, "id">) => void;
  deleteReceivable: (id: string) => void;
}

export const useReceivableStore = create<ReceivableState>()(
  persist(
    (set) => ({
      receivables: DEFAULT_RECEIVABLES,

      addReceivable: (receivable) =>
        set((state) => ({
          receivables: [
            ...state.receivables,
            { ...receivable, id: crypto.randomUUID() },
          ],
        })),

      updateReceivable: (id, receivable) =>
        set((state) => ({
          receivables: state.receivables.map((r) =>
            r.id === id ? { ...r, ...receivable } : r,
          ),
        })),

      deleteReceivable: (id) =>
        set((state) => ({
          receivables: state.receivables.filter((r) => r.id !== id),
        })),
    }),
    { name: "estelaoferta-receivables" },
  ),
);
