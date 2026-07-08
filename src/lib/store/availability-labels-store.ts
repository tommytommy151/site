"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AvailabilityLabel {
  id: string;
  text: string;
  color: string;
}

const DEFAULT_AVAILABILITY_LABELS: AvailabilityLabel[] = [
  { id: "avail-stoc", text: "În stoc", color: "#16a34a" },
  { id: "avail-stoc-limitat", text: "Stoc limitat", color: "#f59e0b" },
  { id: "avail-precomanda", text: "Precomandă", color: "#2563eb" },
  { id: "avail-epuizat", text: "Stoc epuizat", color: "#dc2626" },
];

interface AvailabilityLabelState {
  availabilityLabels: AvailabilityLabel[];
  addAvailabilityLabel: (label: Omit<AvailabilityLabel, "id">) => void;
  updateAvailabilityLabel: (id: string, label: Omit<AvailabilityLabel, "id">) => void;
  deleteAvailabilityLabel: (id: string) => void;
}

export const useAvailabilityLabelStore = create<AvailabilityLabelState>()(
  persist(
    (set) => ({
      availabilityLabels: DEFAULT_AVAILABILITY_LABELS,

      addAvailabilityLabel: (label) =>
        set((state) => ({
          availabilityLabels: [...state.availabilityLabels, { ...label, id: crypto.randomUUID() }],
        })),

      updateAvailabilityLabel: (id, label) =>
        set((state) => ({
          availabilityLabels: state.availabilityLabels.map((l) =>
            l.id === id ? { ...l, ...label } : l,
          ),
        })),

      deleteAvailabilityLabel: (id) =>
        set((state) => ({
          availabilityLabels: state.availabilityLabels.filter((l) => l.id !== id),
        })),
    }),
    { name: "estelaoferta-availability-labels" },
  ),
);
