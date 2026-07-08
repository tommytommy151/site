"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "review-1",
    productName: "Cremă hidratantă cu acid hialuronic",
    customerName: "Ioana Marinescu",
    rating: 5,
    comment: "Textură minunată, s-a absorbit rapid și pielea a devenit vizibil mai hidratată.",
    status: "approved",
  },
  {
    id: "review-2",
    productName: "Ser cu vitamina C",
    customerName: "Andrei Pop",
    rating: 4,
    comment: "Bun produs, dar mirosul e puțin mai puternic decât mă așteptam.",
    status: "pending",
  },
  {
    id: "review-3",
    productName: "Mască de argilă pentru ten gras",
    customerName: "Cristina Dumitrescu",
    rating: 2,
    comment: "Mi-a uscat prea tare pielea, nu recomand pentru ten sensibil.",
    status: "rejected",
  },
  {
    id: "review-4",
    productName: "Loțiune de corp cu unt de shea",
    customerName: "Mihai Constantin",
    rating: 5,
    comment: "Se absoarbe repede și lasă pielea catifelată toată ziua.",
    status: "pending",
  },
];

interface ReviewState {
  reviews: Review[];
  addReview: (review: Omit<Review, "id">) => void;
  updateReview: (id: string, review: Omit<Review, "id">) => void;
  deleteReview: (id: string) => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      reviews: DEFAULT_REVIEWS,

      addReview: (review) =>
        set((state) => ({
          reviews: [...state.reviews, { ...review, id: crypto.randomUUID() }],
        })),

      updateReview: (id, review) =>
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, ...review } : r)),
        })),

      deleteReview: (id) =>
        set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),
    }),
    { name: "estelaoferta-reviews" },
  ),
);
