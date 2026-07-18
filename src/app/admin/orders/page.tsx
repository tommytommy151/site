"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Search, Trash2 } from "lucide-react";
import { ORDER_STATUS_LABELS } from "@/lib/data/orders";
import { useOrderStore } from "@/lib/store/order-store";
import { formatDate, formatPrice } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/types/order";

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Toate" },
  { value: "processing", label: ORDER_STATUS_LABELS.processing },
  { value: "shipped", label: ORDER_STATUS_LABELS.shipped },
  { value: "delivered", label: ORDER_STATUS_LABELS.delivered },
  { value: "cancelled", label: ORDER_STATUS_LABELS.cancelled },
];

export default function AdminOrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const deleteOrder = useOrderStore((s) => s.deleteOrder);
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
  }, [query, status, orders]);

  function handleDeleteOrder(order: (typeof orders)[number]) {
    if (!confirm(`Sigur vrei să ștergi comanda ${order.number}? Acțiunea nu poate fi anulată.`)) {
      return;
    }
    deleteOrder(order.id);
  }

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
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((order) => (
              <tr key={order.id}>
                <td className="p-4 font-medium text-foreground">{order.number}</td>
                <td className="p-4">
                  <p className="text-foreground">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customerEmail || order.customerPhone}
                    {order.customerEmail && order.customerPhone ? ` · ${order.customerPhone}` : ""}
                  </p>
                </td>
                <td className="p-4 text-muted-foreground">{formatDate(order.date)}</td>
                <td className="p-4 text-muted-foreground">{order.paymentMethod}</td>
                <td className="p-4">
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                  >
                    <SelectTrigger size="sm" className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {ORDER_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-4 text-right font-medium text-foreground">
                  {formatPrice(order.total)}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/orders/${order.id}/invoice`}
                      aria-label="Vezi factura"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <FileText className="size-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteOrder(order)}
                      aria-label="Șterge comanda"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-muted-foreground">
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
