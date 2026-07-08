"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift, Heart, Package, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { getOrdersForCustomer } from "@/lib/data/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

export default function AccountDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const orders = user ? getOrdersForCustomer(user.email) : [];
  const recentOrders = orders.slice(0, 3);

  const STATS = [
    { icon: Package, label: "Comenzi", value: orders.length, href: "/account/orders" },
    { icon: Heart, label: "Favorite", value: wishlistCount, href: "/account/wishlist" },
    { icon: Gift, label: "Puncte de fidelitate", value: 240, href: "/account" },
    { icon: Sparkles, label: "Credit magazin", value: formatPrice(0), href: "/account" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bine ai revenit, {user?.name?.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Iată un rezumat al contului tău EstelaOferta.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-emerald-soft text-brand-emerald">
              <stat.icon className="size-4.5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold">Comenzi recente</h2>
          <Link
            href="/account/orders"
            className="group flex items-center gap-1 text-sm font-medium text-brand-emerald"
          >
            Vezi toate
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nu ai plasat încă nicio comandă.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image src={order.items[0].image} alt="" fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{order.number}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.date)} · {order.items.length}{" "}
                    {order.items.length === 1 ? "produs" : "produse"}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
                <span className="w-20 shrink-0 text-right text-sm font-semibold">
                  {formatPrice(order.total)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
