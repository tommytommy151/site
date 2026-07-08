import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { orders } from "@/lib/data/orders";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

const WEEKLY_SALES = [
  { day: "Lun", value: 62 },
  { day: "Mar", value: 78 },
  { day: "Mie", value: 54 },
  { day: "Joi", value: 91 },
  { day: "Vin", value: 86 },
  { day: "Sâm", value: 100 },
  { day: "Dum", value: 71 },
];

export default function AdminDashboardPage() {
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const customerCount = new Set(orders.map((o) => o.customerEmail)).size;
  const avgOrderValue = revenue / orders.length;
  const recentOrders = orders.slice(0, 6);
  const lowStock = products.filter((p) => p.stock <= 20).slice(0, 5);

  const STATS = [
    {
      icon: TrendingUp,
      label: "Venituri totale",
      value: formatPrice(revenue),
      delta: "+12.4%",
    },
    { icon: ShoppingCart, label: "Comenzi", value: orders.length, delta: "+8.1%" },
    { icon: Users, label: "Clienți", value: customerCount, delta: "+3.6%" },
    {
      icon: Package,
      label: "Valoare medie comandă",
      value: formatPrice(avgOrderValue),
      delta: "+1.9%",
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
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-emerald-soft text-brand-emerald">
                <stat.icon className="size-4.5" />
              </span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-brand-emerald">
                <ArrowUpRight className="size-3" />
                {stat.delta}
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Vânzări — ultimele 7 zile</h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {WEEKLY_SALES.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end overflow-hidden rounded-lg bg-muted">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-brand-emerald to-brand-indigo"
                    style={{ height: `${d.value}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
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
              </div>
            ))}
          </div>
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
