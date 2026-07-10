"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReturnStatus = "pending" | "approved" | "rejected";

export const RETURN_REASONS = [
  "Produsul este defect",
  "Nu corespunde descrierii",
  "Am comandat din greșeală",
  "Mărime/culoare greșită",
  "Nu mai am nevoie de el",
  "Altul",
] as const;

export type ReturnReason = (typeof RETURN_REASONS)[number];

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  productName: string;
  reason: ReturnReason;
  comments: string;
  status: ReturnStatus;
  createdAt: string;
}

interface ReturnsState {
  requests: ReturnRequest[];
  addRequest: (request: Omit<ReturnRequest, "id" | "status" | "createdAt">) => void;
  updateStatus: (id: string, status: ReturnStatus) => void;
  deleteRequest: (id: string) => void;
}

export const useReturnsStore = create<ReturnsState>()(
  persist(
    (set) => ({
      requests: [],

      addRequest: (request) =>
        set((state) => ({
          requests: [
            {
              ...request,
              id: crypto.randomUUID(),
              status: "pending",
              createdAt: new Date().toISOString(),
            },
            ...state.requests,
          ],
        })),

      updateStatus: (id, status) =>
        set((state) => ({
          requests: state.requests.map((r) => (r.id === id ? { ...r, status } : r)),
        })),

      deleteRequest: (id) =>
        set((state) => ({ requests: state.requests.filter((r) => r.id !== id) })),
    }),
    { name: "estelaoferta-returns" },
  ),
);
