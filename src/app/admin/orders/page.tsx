"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { orders, ORDER_STATUS_LABELS } from "@/lib/data/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import type { OrderStatus } from "@/types/order";

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Toate" },
  { value: "processing", label: ORDER_STATUS_LABELS.processing },
  { value: "shipped", label: ORDER_STATUS_LABELS.shipped },
  { value: "delivered", label: ORDER_STATUS_LABELS.delivered },
  { value: "cancelled", label: ORDER_STATUS_LABELS.cancelled },
];

export default function AdminOrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    return orders
      .filter((o) => status === "all" || o.status === status)
      .filter(
        (o) =>
          !query.trim() ||
          o.number.toLowerCase().includes(query.toLowerCase()) ||
          o.customerName.toLowerCase().includes(query.toLowerCase()),
      );
  }, [query, status]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Comenzi</h1>
        <p className="mt-1 text-sm text-muted-foreground">{orders.length} comenzi în total.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                status === f.value
                  ? "border-brand-emerald bg-brand-emerald-soft text-brand-emerald"
                  : "border-border text-foreground/70 hover:border-foreground/30",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută comandă sau client..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Comandă</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Dată</th>
              <th className="p-4 font-medium">Plată</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((order) => (
              <tr key={order.id}>
                <td className="p-4 font-medium text-foreground">{order.number}</td>
                <td className="p-4">
                  <p className="text-foreground">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                </td>
                <td className="p-4 text-muted-foreground">{formatDate(order.date)}</td>
                <td className="p-4 text-muted-foreground">{order.paymentMethod}</td>
                <td className="p-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="p-4 text-right font-medium text-foreground">
                  {formatPrice(order.total)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted-foreground">
                  Nicio comandă găsită.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
