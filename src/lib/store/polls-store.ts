"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Poll {
  id: string;
  question: string;
  options: string[];
  active: boolean;
}

const DEFAULT_POLLS: Poll[] = [
  {
    id: "poll-livrare",
    question: "Ce metodă de livrare preferi?",
    options: ["Curier rapid", "Ridicare din magazin", "Easybox"],
    active: true,
  },
  {
    id: "poll-satisfactie",
    question: "Cât de mulțumit ești de ultima comandă?",
    options: ["Foarte mulțumit", "Mulțumit", "Nemulțumit"],
    active: false,
  },
];

interface PollsState {
  polls: Poll[];
  addPoll: (poll: Omit<Poll, "id">) => void;
  updatePoll: (id: string, poll: Omit<Poll, "id">) => void;
  deletePoll: (id: string) => void;
}

export const usePollsStore = create<PollsState>()(
  persist(
    (set) => ({
      polls: DEFAULT_POLLS,

      addPoll: (poll) =>
        set((state) => ({
          polls: [...state.polls, { ...poll, id: crypto.randomUUID() }],
        })),
      updatePoll: (id, poll) =>
        set((state) => ({
          polls: state.polls.map((p) => (p.id === id ? { ...p, ...poll } : p)),
        })),
      deletePoll: (id) =>
        set((state) => ({ polls: state.polls.filter((p) => p.id !== id) })),
    }),
    { name: "estelaoferta-polls" },
  ),
);
