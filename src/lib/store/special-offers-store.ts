"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SpecialOffer {
  id: string;
  title: string;
  discountPct: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

const DEFAULT_SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: "offer-vara",
    title: "Ofertă de vară",
    discountPct: 20,
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    active: true,
  },
  {
    id: "offer-black-friday",
    title: "Black Friday anticipat",
    discountPct: 35,
    startDate: "2026-11-10",
    endDate: "2026-11-30",
    active: false,
  },
  {
    id: "offer-cadouri",
    title: "Cadouri de sărbători",
    discountPct: 15,
    startDate: "2026-12-01",
    endDate: "2026-12-24",
    active: false,
  },
];

interface SpecialOfferState {
  specialOffers: SpecialOffer[];
  addSpecialOffer: (offer: Omit<SpecialOffer, "id">) => void;
  updateSpecialOffer: (id: string, offer: Omit<SpecialOffer, "id">) => void;
  deleteSpecialOffer: (id: string) => void;
}

export const useSpecialOfferStore = create<SpecialOfferState>()(
  persist(
    (set) => ({
      specialOffers: DEFAULT_SPECIAL_OFFERS,

      addSpecialOffer: (offer) =>
        set((state) => ({
          specialOffers: [...state.specialOffers, { ...offer, id: crypto.randomUUID() }],
        })),

      updateSpecialOffer: (id, offer) =>
        set((state) => ({
          specialOffers: state.specialOffers.map((o) => (o.id === id ? { ...o, ...offer } : o)),
        })),

      deleteSpecialOffer: (id) =>
        set((state) => ({
          specialOffers: state.specialOffers.filter((o) => o.id !== id),
        })),
    }),
    { name: "estelaoferta-special-offers" },
  ),
);
