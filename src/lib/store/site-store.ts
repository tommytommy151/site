"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CustomPage, HeroContent, HomeSection, MenuItem, SiteSettings } from "@/types/site";
import {
  DEFAULT_HERO,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_MENU,
  DEFAULT_SITE_SETTINGS,
} from "@/lib/data/site-defaults";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface SiteState {
  settings: SiteSettings;
  pages: CustomPage[];
  menu: MenuItem[];
  hero: HeroContent;
  homeSections: HomeSection[];

  setLogoText: (text: string) => void;
  setLogoImageUrl: (url: string | null) => void;
  setSiteTitle: (title: string) => void;
  setSiteDescription: (description: string) => void;
  resetSettings: () => void;

  addPage: (page: Omit<CustomPage, "id" | "createdAt">) => void;
  updatePage: (id: string, page: Omit<CustomPage, "id" | "createdAt">) => void;
  deletePage: (id: string) => void;

  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, item: Omit<MenuItem, "id">) => void;
  deleteMenuItem: (id: string) => void;
  moveMenuItem: (id: string, direction: "up" | "down") => void;
  resetMenu: () => void;

  updateHero: (hero: HeroContent) => void;
  resetHero: () => void;

  toggleSectionVisible: (id: string) => void;
  moveSection: (id: string, direction: "up" | "down") => void;
  resetHomeSections: () => void;
}

function moveInArray<T>(arr: T[], index: number, direction: "up" | "down"): T[] {
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

export const useSiteStore = create<SiteState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SITE_SETTINGS,
      pages: [],
      menu: DEFAULT_MENU,
      hero: DEFAULT_HERO,
      homeSections: DEFAULT_HOME_SECTIONS,

      setLogoText: (logoText) =>
        set((state) => ({ settings: { ...state.settings, logoText } })),

      setLogoImageUrl: (logoImageUrl) =>
        set((state) => ({ settings: { ...state.settings, logoImageUrl } })),

      setSiteTitle: (siteTitle) =>
        set((state) => ({ settings: { ...state.settings, siteTitle } })),

      setSiteDescription: (siteDescription) =>
        set((state) => ({ settings: { ...state.settings, siteDescription } })),

      resetSettings: () => set({ settings: DEFAULT_SITE_SETTINGS }),

      addPage: (page) =>
        set((state) => ({
          pages: [
            ...state.pages,
            { ...page, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ],
        })),

      updatePage: (id, page) =>
        set((state) => ({
          pages: state.pages.map((p) => (p.id === id ? { ...p, ...page } : p)),
        })),

      deletePage: (id) =>
        set((state) => ({ pages: state.pages.filter((p) => p.id !== id) })),

      addMenuItem: (item) =>
        set((state) => ({
          menu: [...state.menu, { ...item, id: crypto.randomUUID() }],
        })),

      updateMenuItem: (id, item) =>
        set((state) => ({
          menu: state.menu.map((m) => (m.id === id ? { ...m, ...item } : m)),
        })),

      deleteMenuItem: (id) =>
        set((state) => ({ menu: state.menu.filter((m) => m.id !== id) })),

      moveMenuItem: (id, direction) =>
        set((state) => {
          const index = state.menu.findIndex((m) => m.id === id);
          if (index === -1) return state;
          return { menu: moveInArray(state.menu, index, direction) };
        }),

      resetMenu: () => set({ menu: DEFAULT_MENU }),

      updateHero: (hero) => set({ hero }),
      resetHero: () => set({ hero: DEFAULT_HERO }),

      toggleSectionVisible: (id) =>
        set((state) => ({
          homeSections: state.homeSections.map((s) =>
            s.id === id ? { ...s, visible: !s.visible } : s,
          ),
        })),

      moveSection: (id, direction) =>
        set((state) => {
          const index = state.homeSections.findIndex((s) => s.id === id);
          if (index === -1) return state;
          return { homeSections: moveInArray(state.homeSections, index, direction) };
        }),

      resetHomeSections: () => set({ homeSections: DEFAULT_HOME_SECTIONS }),
    }),
    {
      name: "estelaoferta-site",
      version: 3,
      migrate: (persisted) => {
        const state = persisted as SiteState;
        const existingSections = state.homeSections ?? DEFAULT_HOME_SECTIONS;
        const missingSections = DEFAULT_HOME_SECTIONS.filter(
          (defaultSection) => !existingSections.some((s) => s.id === defaultSection.id),
        );
        return {
          ...state,
          pages: (state.pages ?? []).map((p) => ({
            ...p,
            showInHeader: p.showInHeader ?? false,
          })),
          menu: state.menu ?? DEFAULT_MENU,
          hero: state.hero ?? DEFAULT_HERO,
          homeSections: [...missingSections, ...existingSections],
        };
      },
    },
  ),
);
