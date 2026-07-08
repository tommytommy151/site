"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_TAGS: Tag[] = [
  { id: "tag-reducere", name: "Reducere", color: "#dc2626" },
  { id: "tag-noutate", name: "Noutate", color: "#2563eb" },
  { id: "tag-recomandat", name: "Recomandat", color: "#9333ea" },
  { id: "tag-eco", name: "Eco-friendly", color: "#16a34a" },
];

interface TagState {
  tags: Tag[];
  addTag: (tag: Omit<Tag, "id">) => void;
  updateTag: (id: string, tag: Omit<Tag, "id">) => void;
  deleteTag: (id: string) => void;
}

export const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      tags: DEFAULT_TAGS,

      addTag: (tag) =>
        set((state) => ({
          tags: [...state.tags, { ...tag, id: crypto.randomUUID() }],
        })),

      updateTag: (id, tag) =>
        set((state) => ({
          tags: state.tags.map((t) => (t.id === id ? { ...t, ...tag } : t)),
        })),

      deleteTag: (id) =>
        set((state) => ({ tags: state.tags.filter((t) => t.id !== id) })),
    }),
    { name: "estelaoferta-tags" },
  ),
);
