"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminRole {
  id: string;
  name: string;
  permissions: string[];
}

const DEFAULT_ADMIN_ROLES: AdminRole[] = [
  {
    id: "role-admin",
    name: "Administrator",
    permissions: ["Comenzi", "Produse", "Clienți", "Setări", "Marketing"],
  },
  {
    id: "role-manager",
    name: "Manager magazin",
    permissions: ["Comenzi", "Produse", "Clienți"],
  },
  {
    id: "role-suport",
    name: "Suport clienți",
    permissions: ["Comenzi", "Clienți"],
  },
];

interface AdminRoleState {
  adminRoles: AdminRole[];
  addAdminRole: (role: Omit<AdminRole, "id">) => void;
  updateAdminRole: (id: string, role: Omit<AdminRole, "id">) => void;
  deleteAdminRole: (id: string) => void;
}

export const useAdminRoleStore = create<AdminRoleState>()(
  persist(
    (set) => ({
      adminRoles: DEFAULT_ADMIN_ROLES,

      addAdminRole: (role) =>
        set((state) => ({
          adminRoles: [...state.adminRoles, { ...role, id: crypto.randomUUID() }],
        })),

      updateAdminRole: (id, role) =>
        set((state) => ({
          adminRoles: state.adminRoles.map((r) => (r.id === id ? { ...r, ...role } : r)),
        })),

      deleteAdminRole: (id) =>
        set((state) => ({ adminRoles: state.adminRoles.filter((r) => r.id !== id) })),
    }),
    { name: "estelaoferta-admin-roles" },
  ),
);
