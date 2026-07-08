"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomerField {
  id: string;
  label: string;
  type: "text" | "number" | "select";
  required: boolean;
}

const DEFAULT_CUSTOMER_FIELDS: CustomerField[] = [
  { id: "field-cnp", label: "CNP", type: "text", required: false },
  { id: "field-company", label: "Denumire firmă", type: "text", required: false },
  { id: "field-employees", label: "Număr angajați", type: "number", required: false },
  {
    id: "field-industry",
    label: "Domeniu de activitate",
    type: "select",
    required: true,
  },
];

interface CustomerFieldState {
  customerFields: CustomerField[];
  addCustomerField: (field: Omit<CustomerField, "id">) => void;
  updateCustomerField: (id: string, field: Omit<CustomerField, "id">) => void;
  deleteCustomerField: (id: string) => void;
}

export const useCustomerFieldStore = create<CustomerFieldState>()(
  persist(
    (set) => ({
      customerFields: DEFAULT_CUSTOMER_FIELDS,

      addCustomerField: (field) =>
        set((state) => ({
          customerFields: [
            ...state.customerFields,
            { ...field, id: crypto.randomUUID() },
          ],
        })),

      updateCustomerField: (id, field) =>
        set((state) => ({
          customerFields: state.customerFields.map((f) =>
            f.id === id ? { ...f, ...field } : f,
          ),
        })),

      deleteCustomerField: (id) =>
        set((state) => ({
          customerFields: state.customerFields.filter((f) => f.id !== id),
        })),
    }),
    { name: "estelaoferta-customer-fields" },
  ),
);
