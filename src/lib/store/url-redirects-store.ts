"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RedirectType = "301" | "302";

export interface UrlRedirect {
  id: string;
  fromPath: string;
  toPath: string;
  type: RedirectType;
}

const DEFAULT_URL_REDIRECTS: UrlRedirect[] = [
  { id: "redir-vechi", fromPath: "/produse-vechi", toPath: "/produse", type: "301" },
  { id: "redir-promo", fromPath: "/black-friday-2024", toPath: "/oferte", type: "302" },
];

interface UrlRedirectState {
  urlRedirects: UrlRedirect[];
  addUrlRedirect: (redirect: Omit<UrlRedirect, "id">) => void;
  updateUrlRedirect: (id: string, redirect: Omit<UrlRedirect, "id">) => void;
  deleteUrlRedirect: (id: string) => void;
}

export const useUrlRedirectStore = create<UrlRedirectState>()(
  persist(
    (set) => ({
      urlRedirects: DEFAULT_URL_REDIRECTS,

      addUrlRedirect: (redirect) =>
        set((state) => ({
          urlRedirects: [...state.urlRedirects, { ...redirect, id: crypto.randomUUID() }],
        })),

      updateUrlRedirect: (id, redirect) =>
        set((state) => ({
          urlRedirects: state.urlRedirects.map((r) => (r.id === id ? { ...r, ...redirect } : r)),
        })),

      deleteUrlRedirect: (id) =>
        set((state) => ({ urlRedirects: state.urlRedirects.filter((r) => r.id !== id) })),
    }),
    { name: "estelaoferta-url-redirects" },
  ),
);
