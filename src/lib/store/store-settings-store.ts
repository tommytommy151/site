"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "EstelaOferta Commerce SRL",
  contactEmail: "contact@estelaoferta.ro",
  contactPhone: "+40 731 234 567",
  address: "Str. Aviatorilor 23, București, Sector 1",
};

interface StoreSettingsState {
  settings: StoreSettings;
  updateSettings: (settings: StoreSettings) => void;
  resetSettings: () => void;
}

export const useStoreSettingsStore = create<StoreSettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_STORE_SETTINGS,
      updateSettings: (settings) => set({ settings }),
      resetSettings: () => set({ settings: DEFAULT_STORE_SETTINGS }),
    }),
    { name: "estelaoferta-store-settings" },
  ),
);
