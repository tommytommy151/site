"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Promotion {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: "promo-2plus1",
    name: "2+1 gratis",
    description: "La achiziția a două produse din aceeași categorie, al treilea este gratuit.",
    active: true,
  },
  {
    id: "promo-livrare-gratuita",
    name: "Livrare gratuită",
    description: "Livrare gratuită pentru comenzile de peste 250 lei, la nivel național.",
    active: true,
  },
  {
    id: "promo-cadou-surpriza",
    name: "Cadou surpriză",
    description: "Un produs cadou pentru fiecare comandă de peste 300 lei.",
    active: false,
  },
];

interface PromotionState {
  promotions: Promotion[];
  addPromotion: (promotion: Omit<Promotion, "id">) => void;
  updatePromotion: (id: string, promotion: Omit<Promotion, "id">) => void;
  deletePromotion: (id: string) => void;
}

export const usePromotionStore = create<PromotionState>()(
  persist(
    (set) => ({
      promotions: DEFAULT_PROMOTIONS,

      addPromotion: (promotion) =>
        set((state) => ({
          promotions: [...state.promotions, { ...promotion, id: crypto.randomUUID() }],
        })),

      updatePromotion: (id, promotion) =>
        set((state) => ({
          promotions: state.promotions.map((p) => (p.id === id ? { ...p, ...promotion } : p)),
        })),

      deletePromotion: (id) =>
        set((state) => ({ promotions: state.promotions.filter((p) => p.id !== id) })),
    }),
    { name: "estelaoferta-promotions" },
  ),
);
