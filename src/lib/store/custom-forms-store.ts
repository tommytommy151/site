"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomForm {
  id: string;
  name: string;
  fieldsCount: number;
  submissionsCount: number;
}

const DEFAULT_CUSTOM_FORMS: CustomForm[] = [
  { id: "form-contact", name: "Formular de contact", fieldsCount: 4, submissionsCount: 128 },
  { id: "form-retur", name: "Cerere de retur", fieldsCount: 6, submissionsCount: 42 },
  { id: "form-parteneri", name: "Parteneriat furnizori", fieldsCount: 5, submissionsCount: 9 },
];

interface CustomFormsState {
  forms: CustomForm[];
  addForm: (form: Omit<CustomForm, "id">) => void;
  updateForm: (id: string, form: Omit<CustomForm, "id">) => void;
  deleteForm: (id: string) => void;
}

export const useCustomFormsStore = create<CustomFormsState>()(
  persist(
    (set) => ({
      forms: DEFAULT_CUSTOM_FORMS,

      addForm: (form) =>
        set((state) => ({
          forms: [...state.forms, { ...form, id: crypto.randomUUID() }],
        })),
      updateForm: (id, form) =>
        set((state) => ({
          forms: state.forms.map((f) => (f.id === id ? { ...f, ...form } : f)),
        })),
      deleteForm: (id) =>
        set((state) => ({ forms: state.forms.filter((f) => f.id !== id) })),
    }),
    { name: "estelaoferta-custom-forms" },
  ),
);
