"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  login: (email: string, _password: string) => AuthUser;
  loginAsAdmin: (email: string, _password: string) => AuthUser;
  register: (name: string, email: string, _password: string) => AuthUser;
  logout: () => void;
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "Client";
  return local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ") || "Client EstelaOferta";
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: (email) => {
        const user: AuthUser = {
          id: `user-${Date.now()}`,
          name: nameFromEmail(email),
          email,
          avatar: `https://picsum.photos/seed/user-${encodeURIComponent(email)}/200/200`,
          role: "customer",
        };
        set({ user });
        return user;
      },

      loginAsAdmin: (email) => {
        const user: AuthUser = {
          id: `admin-${Date.now()}`,
          name: nameFromEmail(email) || "Administrator",
          email,
          avatar: `https://picsum.photos/seed/admin-${encodeURIComponent(email)}/200/200`,
          role: "admin",
        };
        set({ user });
        return user;
      },

      register: (name, email) => {
        const user: AuthUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          avatar: `https://picsum.photos/seed/user-${encodeURIComponent(email)}/200/200`,
          role: "customer",
        };
        set({ user });
        return user;
      },

      logout: () => set({ user: null }),
    }),
    { name: "estelaoferta-auth" },
  ),
);
