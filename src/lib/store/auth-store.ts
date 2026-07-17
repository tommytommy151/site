"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/auth";

export const ADMIN_USERNAME = "admintom";
const ADMIN_PASSWORD_HASH =
  "77a34581a508802181c0a1c1171360c3ef96209e9f6cd047aa2eb5d33173168f";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex === ADMIN_PASSWORD_HASH;
}

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

      login: (rawEmail) => {
        const email = rawEmail.trim();
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

      loginAsAdmin: (rawEmail) => {
        const email = rawEmail.trim();
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

      register: (rawName, rawEmail) => {
        const email = rawEmail.trim();
        const user: AuthUser = {
          id: `user-${Date.now()}`,
          name: rawName.trim(),
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
