"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

interface NewsletterState {
  subscribers: Subscriber[];
  subscribe: (email: string) => boolean;
  removeSubscriber: (id: string) => void;
}

export const useNewsletterStore = create<NewsletterState>()(
  persist(
    (set, get) => ({
      subscribers: [],

      subscribe: (email) => {
        const normalized = email.trim().toLowerCase();
        if (!normalized) return false;
        if (get().subscribers.some((s) => s.email === normalized)) return true;
        set((state) => ({
          subscribers: [
            ...state.subscribers,
            { id: crypto.randomUUID(), email: normalized, subscribedAt: new Date().toISOString() },
          ],
        }));
        return true;
      },

      removeSubscriber: (id) =>
        set((state) => ({ subscribers: state.subscribers.filter((s) => s.id !== id) })),
    }),
    { name: "estelaoferta-newsletter" },
  ),
);
