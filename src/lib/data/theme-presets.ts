import type { ThemePreset } from "@/types/theme";

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "black-friday",
    name: "Black Friday",
    primaryColor: "#e8b84b",
    accentColor: "#e11d2e",
  },
  {
    id: "gold-charcoal",
    name: "Auriu & Cărbune",
    primaryColor: "#cd9c2b",
    accentColor: "#824f32",
  },
  {
    id: "emerald-indigo",
    name: "Smarald & Indigo",
    primaryColor: "#10b981",
    accentColor: "#6366f1",
  },
  {
    id: "blue-cyan",
    name: "Albastru & Cyan",
    primaryColor: "#2563eb",
    accentColor: "#06b6d4",
  },
  {
    id: "coral-pink",
    name: "Corai & Roz",
    primaryColor: "#fb7185",
    accentColor: "#ec4899",
  },
];

export const DEFAULT_THEME = {
  primaryColor: THEME_PRESETS[0].primaryColor,
  accentColor: THEME_PRESETS[0].accentColor,
  radius: 1,
};
