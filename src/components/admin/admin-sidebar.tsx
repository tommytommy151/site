"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteLogo } from "@/components/site-logo";

interface NavChild {
  href: string;
  label: string;
  tab?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  children?: NavChild[];
}

const NAV: NavItem[] = [
  { href: "/admin", label: "Panou principal", icon: LayoutDashboard },
  {
    href: "/admin/vanzari",
    label: "Vânzări",
    icon: ShoppingCart,
    children: [
      { href: "/admin/orders", label: "Comenzi" },
      { href: "/admin/abandoned-carts", label: "Coșuri de cumpărături abandonate" },
      { href: "/admin/customers", label: "Clienți" },
      { href: "/admin/customer-groups", label: "Grupuri clienți" },
      { href: "/admin/loyalty-points", label: "Puncte bonus" },
      { href: "/admin/customer-fields", label: "Câmpuri clienți" },
      { href: "/admin/orders", label: "Facturi" },
      { href: "/admin/payment-methods", label: "Plăți" },
      { href: "/admin/receivables", label: "Creanțe" },
    ],
  },
  {
    href: "/admin/products",
    label: "Produse",
    icon: Package,
    children: [
      { href: "/admin/products", label: "Produse" },
      { href: "/admin/product-options", label: "Opțiuni produse" },
      { href: "/admin/categories", label: "Categorii" },
      { href: "/admin/brands", label: "Producători" },
      { href: "/admin/attributes", label: "Atribute" },
      { href: "/admin/availability-labels", label: "Etichete de disponibilitate" },
      { href: "/admin/tags", label: "Etichete" },
      { href: "/admin/import", label: "Import" },
    ],
  },
  {
    href: "/admin/marketing",
    label: "Marketing",
    icon: Megaphone,
    children: [
      { href: "/admin/special-offers", label: "Oferte promoționale" },
      { href: "/admin/reviews", label: "Evaluări și recenzii" },
      { href: "/admin/discounts", label: "Reduceri" },
      { href: "/admin/coupons", label: "Cupoane de reduceri" },
      { href: "/admin/promotions", label: "Promoții" },
      { href: "/admin/wishlists-overview", label: "Liste de favorite" },
      { href: "/admin/newsletter", label: "Buletin informativ" },
      { href: "/admin/push-notifications", label: "Notificări Push" },
      { href: "/admin/marketing-campaigns", label: "Campanii de marketing" },
      { href: "/admin/social", label: "Generator postări social media" },
    ],
  },
  {
    href: "/admin/pagini",
    label: "Pagini",
    icon: FileText,
    children: [
      { href: "/admin/theme?tab=pages", label: "Pagini web", tab: "pages" },
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/custom-forms", label: "Formulare" },
      { href: "/admin/image-galleries", label: "Galerii de imagini" },
      { href: "/admin/polls", label: "Sondaje" },
    ],
  },
  {
    href: "/admin/theme",
    label: "Design",
    icon: Palette,
    children: [
      { href: "/admin/theme?tab=colors", tab: "colors", label: "Culori" },
      { href: "/admin/theme?tab=menu", tab: "menu", label: "Meniuri" },
      { href: "/admin/theme?tab=banner", tab: "banner", label: "Banere" },
      { href: "/admin/theme?tab=layout", tab: "layout", label: "Layout-uri" },
      { href: "/admin/theme?tab=pages", tab: "pages", label: "Pagini" },
      { href: "/admin/theme?tab=logo-seo", tab: "logo-seo", label: "Logo & SEO" },
    ],
  },
  {
    href: "/admin/configurare",
    label: "Configurare",
    icon: Settings,
    children: [
      { href: "/admin/settings", label: "Setări generale" },
      { href: "/admin/shipping-methods", label: "Plată & livrare" },
      { href: "/admin/tax-rates", label: "Taxe & locații" },
      { href: "/admin/locales-currencies", label: "Limbi & valute" },
      { href: "/admin/basic-seo", label: "SEO de bază" },
      { href: "/admin/url-redirects", label: "Redirecționare URL-uri" },
      { href: "/admin/admin-roles", label: "Roluri administratori" },
    ],
  },
];

function isChildActive(child: NavChild, pathname: string, activeTab: string | null): boolean {
  if (child.tab !== undefined) {
    return pathname === "/admin/theme" && (activeTab ?? "colors") === child.tab;
  }
  return pathname === child.href;
}

export function AdminSidebar() {
  return (
    <Suspense fallback={null}>
      <AdminSidebarContent />
    </Suspense>
  );
}

function AdminSidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const activeTab = searchParams.get("tab");
  const [openItems, setOpenItems] = useState<string[]>(() => {
    const activeGroup = NAV.find((item) =>
      item.children?.some((child) => isChildActive(child, pathname, searchParams.get("tab"))),
    );
    return activeGroup ? [activeGroup.href] : [];
  });

  function toggleGroup(href: string) {
    setOpenItems((items) =>
      items.includes(href) ? items.filter((h) => h !== href) : [...items, href],
    );
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card print:hidden">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <SiteLogo className="flex min-w-0 items-center gap-2" />
        <span className="ml-auto shrink-0 rounded-full bg-brand-indigo-soft px-2 py-0.5 text-[10px] font-semibold text-brand-indigo">
          ADMIN
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV.map((item) => {
          const isOpen = openItems.includes(item.href);

          if (item.children) {
            const active = item.children.some((child) =>
              isChildActive(child, pathname, activeTab),
            );
            return (
              <div key={item.href} className="flex flex-col">
                <button
                  onClick={() => toggleGroup(item.href)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-emerald-soft text-brand-emerald"
                      : "text-foreground/75 hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "ml-auto size-3.5 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-border pl-4">
                    {item.children.map((child) => {
                      const childActive = isChildActive(child, pathname, activeTab);
                      return (
                        <Link
                          key={child.href + child.label}
                          href={child.href}
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            childActive
                              ? "text-brand-emerald"
                              : "text-foreground/65 hover:bg-muted hover:text-foreground",
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

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
