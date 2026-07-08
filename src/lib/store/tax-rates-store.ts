"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TaxRate {
  id: string;
  name: string;
  ratePct: number;
  region: string;
}

const DEFAULT_TAX_RATES: TaxRate[] = [
  { id: "tax-standard", name: "TVA standard", ratePct: 19, region: "România" },
  { id: "tax-redusa", name: "TVA redusă (cărți, alimente)", ratePct: 9, region: "România" },
  { id: "tax-ue", name: "TVA intracomunitară", ratePct: 0, region: "Uniunea Europeană" },
];

interface TaxRateState {
  taxRates: TaxRate[];
  addTaxRate: (taxRate: Omit<TaxRate, "id">) => void;
  updateTaxRate: (id: string, taxRate: Omit<TaxRate, "id">) => void;
  deleteTaxRate: (id: string) => void;
}

export const useTaxRateStore = create<TaxRateState>()(
  persist(
    (set) => ({
      taxRates: DEFAULT_TAX_RATES,

      addTaxRate: (taxRate) =>
        set((state) => ({
          taxRates: [...state.taxRates, { ...taxRate, id: crypto.randomUUID() }],
        })),

      updateTaxRate: (id, taxRate) =>
        set((state) => ({
          taxRates: state.taxRates.map((t) => (t.id === id ? { ...t, ...taxRate } : t)),
        })),

      deleteTaxRate: (id) =>
        set((state) => ({ taxRates: state.taxRates.filter((t) => t.id !== id) })),
    }),
    { name: "estelaoferta-tax-rates" },
  ),
);
