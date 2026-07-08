"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Currency {
  id: string;
  code: string;
  symbol: string;
  rate: number;
  active: boolean;
}

export interface Language {
  id: string;
  code: string;
  name: string;
  active: boolean;
}

const DEFAULT_CURRENCIES: Currency[] = [
  { id: "cur-ron", code: "RON", symbol: "lei", rate: 1, active: true },
  { id: "cur-eur", code: "EUR", symbol: "€", rate: 4.97, active: true },
  { id: "cur-usd", code: "USD", symbol: "$", rate: 4.58, active: false },
];

const DEFAULT_LANGUAGES: Language[] = [
  { id: "lang-ro", code: "ro", name: "Română", active: true },
  { id: "lang-en", code: "en", name: "Engleză", active: true },
  { id: "lang-hu", code: "hu", name: "Maghiară", active: false },
];

interface LocalesCurrenciesState {
  currencies: Currency[];
  languages: Language[];

  addCurrency: (currency: Omit<Currency, "id">) => void;
  updateCurrency: (id: string, currency: Omit<Currency, "id">) => void;
  deleteCurrency: (id: string) => void;

  addLanguage: (language: Omit<Language, "id">) => void;
  updateLanguage: (id: string, language: Omit<Language, "id">) => void;
  deleteLanguage: (id: string) => void;
}

export const useLocalesCurrenciesStore = create<LocalesCurrenciesState>()(
  persist(
    (set) => ({
      currencies: DEFAULT_CURRENCIES,
      languages: DEFAULT_LANGUAGES,

      addCurrency: (currency) =>
        set((state) => ({
          currencies: [...state.currencies, { ...currency, id: crypto.randomUUID() }],
        })),
      updateCurrency: (id, currency) =>
        set((state) => ({
          currencies: state.currencies.map((c) => (c.id === id ? { ...c, ...currency } : c)),
        })),
      deleteCurrency: (id) =>
        set((state) => ({ currencies: state.currencies.filter((c) => c.id !== id) })),

      addLanguage: (language) =>
        set((state) => ({
          languages: [...state.languages, { ...language, id: crypto.randomUUID() }],
        })),
      updateLanguage: (id, language) =>
        set((state) => ({
          languages: state.languages.map((l) => (l.id === id ? { ...l, ...language } : l)),
        })),
      deleteLanguage: (id) =>
        set((state) => ({ languages: state.languages.filter((l) => l.id !== id) })),
    }),
    { name: "estelaoferta-locales-currencies" },
  ),
);
