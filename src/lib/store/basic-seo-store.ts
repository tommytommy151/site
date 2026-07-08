"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BasicSeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

const DEFAULT_BASIC_SEO_SETTINGS: BasicSeoSettings = {
  metaTitle: "EstelaOferta — Magazin online",
  metaDescription:
    "Descoperă cele mai bune oferte la produse de calitate, livrare rapidă în toată România.",
  keywords: "magazin online, oferte, reduceri, livrare rapidă",
  ogImage: "/og-image.jpg",
};

interface BasicSeoState {
  settings: BasicSeoSettings;
  updateSettings: (settings: BasicSeoSettings) => void;
  resetSettings: () => void;
}

export const useBasicSeoStore = create<BasicSeoState>()(
  persist(
    (set) => ({
      settings: DEFAULT_BASIC_SEO_SETTINGS,
      updateSettings: (settings) => set({ settings }),
      resetSettings: () => set({ settings: DEFAULT_BASIC_SEO_SETTINGS }),
    }),
    { name: "estelaoferta-basic-seo" },
  ),
);
