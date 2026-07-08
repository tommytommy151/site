"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ImageGallery {
  id: string;
  name: string;
  images: string[];
}

const DEFAULT_IMAGE_GALLERIES: ImageGallery[] = [
  {
    id: "gal-vara",
    name: "Colecția de vară",
    images: [
      "https://picsum.photos/seed/vara1/400/300",
      "https://picsum.photos/seed/vara2/400/300",
      "https://picsum.photos/seed/vara3/400/300",
    ],
  },
  {
    id: "gal-showroom",
    name: "Showroom magazin",
    images: [
      "https://picsum.photos/seed/showroom1/400/300",
      "https://picsum.photos/seed/showroom2/400/300",
    ],
  },
];

interface ImageGalleriesState {
  galleries: ImageGallery[];
  addGallery: (gallery: Omit<ImageGallery, "id">) => void;
  updateGallery: (id: string, gallery: Omit<ImageGallery, "id">) => void;
  deleteGallery: (id: string) => void;
}

export const useImageGalleriesStore = create<ImageGalleriesState>()(
  persist(
    (set) => ({
      galleries: DEFAULT_IMAGE_GALLERIES,

      addGallery: (gallery) =>
        set((state) => ({
          galleries: [...state.galleries, { ...gallery, id: crypto.randomUUID() }],
        })),
      updateGallery: (id, gallery) =>
        set((state) => ({
          galleries: state.galleries.map((g) => (g.id === id ? { ...g, ...gallery } : g)),
        })),
      deleteGallery: (id) =>
        set((state) => ({ galleries: state.galleries.filter((g) => g.id !== id) })),
    }),
    { name: "estelaoferta-image-galleries" },
  ),
);
