"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/theme-store";
import { getContrastText } from "@/lib/color-utils";

export function ThemeApplier() {
  const settings = useThemeStore((s) => s.settings);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-emerald", settings.primaryColor);
    root.style.setProperty("--primary-foreground", getContrastText(settings.primaryColor));
    root.style.setProperty("--brand-indigo", settings.accentColor);
    root.style.setProperty("--accent-foreground", getContrastText(settings.accentColor));
    root.style.setProperty("--radius", `${settings.radius}rem`);
  }, [settings]);

  return null;
}
