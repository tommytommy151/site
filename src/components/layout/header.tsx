"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Heart, Menu, Scale, Search, ShoppingBag, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteLogo } from "@/components/site-logo";
import { SearchDialog } from "@/components/layout/search-dialog";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCompareStore } from "@/lib/store/compare-store";
import { useSiteStore } from "@/lib/store/site-store";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
  megaMenu?: boolean;
}

const CATEGORIES_LINK: NavLink = { label: "Categorii", href: "#", megaMenu: true };

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const compareCount = useCompareStore((s) => s.productIds.length);
  const pages = useSiteStore((s) => s.pages);
  const menu = useSiteStore((s) => s.menu);

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 12));
  useEffect(() => setMounted(true), []);

  const headerPages = mounted ? pages.filter((p) => p.showInHeader) : [];
  const navLinks: NavLink[] = [
    CATEGORIES_LINK,
    ...menu,
    ...headerPages.map((p) => ({ label: p.title, href: `/pages/${p.slug}` })),
  ];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="bg-brand-indigo w-full overflow-hidden py-2 text-center text-xs font-semibold tracking-wide text-white sm:text-sm">
        🔥 BLACK FRIDAY — reduceri de până la 70% • livrare gratuită peste 300 RON 🔥
      </div>
      <motion.header
        initial={false}
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled ? "glass shadow-sm" : "border-b border-transparent bg-background",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-4 px-5 sm:px-8 lg:px-10">
          <button
            className="-ml-1.5 flex size-9 items-center justify-center rounded-full lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Deschide meniul"
          >
            <Menu className="size-5" />
          </button>

          <SiteLogo />

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {navLinks.map((link) =>
              link.megaMenu ? (
                <MegaMenu key={link.label} label={link.label} />
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <button
            onClick={() => setSearchOpen(true)}
            className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-brand-emerald/40 sm:flex"
          >
            <Search className="size-4" />
            <span className="flex-1 text-left">Caută produse...</span>
            <kbd className="rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>

          <div className={cn("flex items-center gap-1", "sm:ml-2 ml-auto")}>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex size-9 items-center justify-center rounded-full hover:bg-muted sm:hidden"
              aria-label="Caută"
            >
              <Search className="size-[18px]" />
            </button>
            <ThemeToggle />
            <Link
              href="/compare"
              className="relative hidden size-9 items-center justify-center rounded-full hover:bg-muted sm:flex"
              aria-label="Compară"
            >
              <Scale className="size-[18px]" />
              {mounted && compareCount > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-brand-indigo text-[10px] font-semibold text-white">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link
              href="/account/wishlist"
              className="relative hidden size-9 items-center justify-center rounded-full hover:bg-muted sm:flex"
              aria-label="Favorite"
            >
              <Heart className="size-[18px]" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-brand-emerald text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className="hidden size-9 items-center justify-center rounded-full hover:bg-muted sm:flex"
              aria-label="Cont"
            >
              <User className="size-[18px]" />
            </Link>
            <button
              onClick={openCart}
              className="relative flex size-9 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Deschide coșul"
            >
              <ShoppingBag className="size-[18px]" />
              {mounted && itemCount > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-brand-emerald text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} navLinks={navLinks} />
    </>
  );
}
