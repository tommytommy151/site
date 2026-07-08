"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Palette,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/admin", label: "Panou principal", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produse", icon: Package },
  { href: "/admin/orders", label: "Comenzi", icon: ShoppingCart },
  { href: "/admin/customers", label: "Clienți", icon: Users },
  { href: "/admin/theme", label: "Temă", icon: Palette },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-emerald to-brand-indigo">
          <span className="size-2.5 rounded-full bg-white" />
        </span>
        <span className="font-heading text-base font-semibold tracking-tight">
          Estela<span className="text-brand-emerald">Oferta</span>
        </span>
        <span className="ml-auto rounded-full bg-brand-indigo-soft px-2 py-0.5 text-[10px] font-semibold text-brand-indigo">
          ADMIN
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-emerald-soft text-brand-emerald"
                  : "text-foreground/75 hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
        >
          <Store className="size-4" />
          Vezi magazinul
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive/85 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          Deconectare
        </button>
        <div className="mt-2 flex items-center justify-between rounded-lg px-3 py-2">
          <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
