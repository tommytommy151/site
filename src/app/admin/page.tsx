"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Globe,
  MousePointerClick,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useOrderStore } from "@/lib/store/order-store";
import { useProductStore } from "@/lib/store/product-store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

const DAY_MS = 24 * 60 * 60 * 1000;

function formatDelta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? "+100%" : "+0%";
  const pct = ((current - previous) / previous) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

interface AnalyticsSummary {
  totalVisits: number;
  referrers: { source: string; count: number }[];
  topProducts: { productId: string; name: string; count: number }[];
}

export default function AdminDashboardPage() {
  const orders = useOrderStore((s) => s.orders);
  const products = useProductStore((s) => s.products);

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  useEffect(() => {
    fetch("/api/track/summary")
      .then((res) => (res.ok ? res.json() : null))
      .then(setAnalytics)
      .catch(() => {});
  }, []);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const customerCount = new Set(orders.map((o) => o.customerEmail)).size;
  const avgOrderValue = orders.length ? revenue / orders.length : 0;
  const recentOrders = orders.slice(0, 6);
  const lowStock = products.filter((p) => p.stock <= 20).slice(0, 5);

  const now = Date.now();
  const last7 = orders.filter((o) => now - new Date(o.date).getTime() < 7 * DAY_MS);
  const prev7 = orders.filter((o) => {
    const age = now - new Date(o.date).getTime();
    return age >= 7 * DAY_MS && age < 14 * DAY_MS;
  });
  const revenueLast7 = last7.reduce((sum, o) => sum + o.total, 0);
  const revenuePrev7 = prev7.reduce((sum, o) => sum + o.total, 0);
  const customersLast7 = new Set(last7.map((o) => o.customerEmail)).size;
  const customersPrev7 = new Set(prev7.map((o) => o.customerEmail)).size;
  const aovLast7 = last7.length ? revenueLast7 / last7.length : 0;
  const aovPrev7 = prev7.length ? revenuePrev7 / prev7.length : 0;

  const weeklySales = Array.from({ length: 7 }, (_, i) => {
    const dayStart = now - (6 - i) * DAY_MS;
    const date = new Date(dayStart);
    const dayTotal = orders
      .filter((o) => {
        const d = new Date(o.date);
        return (
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
        );
      })
      .reduce((sum, o) => sum + o.total, 0);
    return {
      day: date.toLocaleDateString("ro-RO", { weekday: "short" }).replace(".", ""),
      total: dayTotal,
    };
  });
  const maxDay = Math.max(1, ...weeklySales.map((d) => d.total));

  const STATS = [
    {
      icon: TrendingUp,
      label: "Venituri totale",
      value: formatPrice(revenue),
      delta: formatDelta(revenueLast7, revenuePrev7),
    },
    {
      icon: ShoppingCart,
      label: "Comenzi",
      value: orders.length,
      delta: formatDelta(last7.length, prev7.length),
    },
    {
      icon: Users,
      label: "Clienți",
      value: customerCount,
      delta: formatDelta(customersLast7, customersPrev7),
    },
    {
      icon: Package,
      label: "Valoare medie comandă",
      value: formatPrice(avgOrderValue),
      delta: formatDelta(aovLast7, aovPrev7),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Panou principal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Prezentare generală a performanței magazinului tău.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => {
          const isNegative = stat.delta.startsWith("-");
          return (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-emerald-soft text-brand-emerald">
                  <stat.icon className="size-4.5" />
                </span>
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    isNegative ? "text-destructive" : "text-brand-emerald",
                  )}
                >
                  {isNegative ? (
                    <ArrowDownRight className="size-3" />
                  ) : (
                    <ArrowUpRight className="size-3" />
                  )}
                  {stat.delta}
                </span>
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Vânzări — ultimele 7 zile</h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {weeklySales.map((d, i) => (
              <div key={`${d.day}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end overflow-hidden rounded-lg bg-muted">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-brand-emerald to-brand-indigo"
                    style={{ height: `${Math.max(4, (d.total / maxDay) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground capitalize">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Stoc redus</h2>
          <div className="mt-4 flex flex-col divide-y divide-border">
            {lowStock.map((product) => (
              <div key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.stock} bucăți rămase</p>
                </div>
                <p className="shrink-0 text-sm font-medium text-foreground">
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Vizite site</h2>
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-emerald-soft text-brand-emerald">
              <Users className="size-4.5" />
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight">
            {analytics ? analytics.totalVisits : "—"}
          </p>
          <p className="text-xs text-muted-foreground">total, de la activarea urmăririi</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">De unde au venit</h2>
            <Globe className="size-4.5 text-muted-foreground" />
          </div>
          {analytics && analytics.referrers.length > 0 ? (
            <div className="flex flex-col divide-y divide-border">
              {analytics.referrers.map((r) => (
                <div key={r.source} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <span className="truncate text-sm text-foreground/85">
                    {r.source === "direct" ? "Acces direct" : r.source}
                  </span>
                  <span className="text-sm font-medium text-foreground">{r.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Încă nu sunt date.</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Produse cele mai vizualizate</h2>
            <MousePointerClick className="size-4.5 text-muted-foreground" />
          </div>
          {analytics && analytics.topProducts.length > 0 ? (
            <div className="flex flex-col divide-y divide-border">
              {analytics.topProducts.map((p) => {
                const match = products.find((prod) => prod.id === p.productId);
                return (
                  <Link
                    key={p.productId}
                    href={`/admin/products/${p.productId}`}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground/85">{p.name}</p>
                      {match && (
                        <p className="text-xs text-muted-foreground">{formatPrice(match.price)}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-sm font-medium text-foreground">{p.count}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Încă nu sunt date.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold">Comenzi recente</h2>
          <Link href="/admin/orders" className="group flex items-center gap-1 text-sm font-medium text-brand-emerald">
            Vezi toate
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                <th className="pb-3 font-medium">Comandă</th>
                <th className="pb-3 font-medium">Client</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 font-medium text-foreground">{order.number}</td>
                  <td className="py-3 text-muted-foreground">{order.customerName}</td>
                  <td className="py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 text-right font-medium text-foreground">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
