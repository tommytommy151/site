"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeSettings } from "@/types/theme";
import { DEFAULT_THEME } from "@/lib/data/theme-presets";

interface ThemeState {
  settings: ThemeSettings;
  setPrimaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  setRadius: (radius: number) => void;
  applyPreset: (primaryColor: string, accentColor: string) => void;
  reset: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      settings: DEFAULT_THEME,

      setPrimaryColor: (color) =>
        set((state) => ({ settings: { ...state.settings, primaryColor: color } })),

      setAccentColor: (color) =>
        set((state) => ({ settings: { ...state.settings, accentColor: color } })),

      setRadius: (radius) => set((state) => ({ settings: { ...state.settings, radius } })),

      applyPreset: (primaryColor, accentColor) =>
        set((state) => ({ settings: { ...state.settings, primaryColor, accentColor } })),

      reset: () => set({ settings: DEFAULT_THEME }),
    }),
    { name: "estelaoferta-theme" },
  ),
);
