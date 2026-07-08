"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";

const NAV = [
  { href: "/account", label: "Panou principal", icon: LayoutDashboard },
  { href: "/account/orders", label: "Comenzile mele", icon: Package },
  { href: "/account/wishlist", label: "Favorite", icon: Heart },
  { href: "/account/addresses", label: "Adrese", icon: MapPin },
  { href: "/account/settings", label: "Setări cont", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-muted">
          {user && <Image src={user.avatar} alt={user.name} fill className="object-cover" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
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
        <button
          onClick={handleLogout}
          className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive/85 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          Deconectare
        </button>
      </nav>
    </aside>
  );
}
