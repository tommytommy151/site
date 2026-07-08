"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LoyaltyPointsSettings {
  pointsPerLeu: number;
  redeemRateLei: number;
}

const DEFAULT_LOYALTY_POINTS_SETTINGS: LoyaltyPointsSettings = {
  pointsPerLeu: 1,
  redeemRateLei: 0.05,
};

interface LoyaltyPointsState {
  settings: LoyaltyPointsSettings;
  updateSettings: (settings: LoyaltyPointsSettings) => void;
  resetSettings: () => void;
}

export const useLoyaltyPointsStore = create<LoyaltyPointsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_LOYALTY_POINTS_SETTINGS,
      updateSettings: (settings) => set({ settings }),
      resetSettings: () => set({ settings: DEFAULT_LOYALTY_POINTS_SETTINGS }),
    }),
    { name: "estelaoferta-loyalty-points" },
  ),
);
