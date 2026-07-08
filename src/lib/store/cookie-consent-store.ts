"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ConsentStatus = "pending" | "accepted" | "rejected";

interface CookieConsentState {
  status: ConsentStatus;
  acceptAll: () => void;
  rejectAll: () => void;
}

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set) => ({
      status: "pending",
      acceptAll: () => set({ status: "accepted" }),
      rejectAll: () => set({ status: "rejected" }),
    }),
    { name: "estelaoferta-cookie-consent" },
  ),
);
