"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useOrderStore } from "@/lib/store/order-store";
import { formatDate, formatPrice } from "@/lib/format";
import { Input } from "@/components/ui/input";

interface CustomerRow {
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function AdminCustomersPage() {
  const orders = useOrderStore((s) => s.orders);
  const [query, setQuery] = useState("");

  const customers = useMemo(() => {
    const map = new Map<string, CustomerRow>();
    for (const order of orders) {
      const existing = map.get(order.customerEmail);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.total;
        if (new Date(order.date) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.date;
        }
      } else {
        map.set(order.customerEmail, {
          name: order.customerName,
          email: order.customerEmail,
          orderCount: 1,
          totalSpent: order.total,
          lastOrderDate: order.date,
        });
      }
    }
    return Array.from(map.values())
      .filter(
        (c) =>
          !query.trim() ||
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [query, orders]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clienți</h1>
        <p className="mt-1 text-sm text-muted-foreground">{customers.length} clienți unici.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută clienți..."
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Comenzi</th>
              <th className="p-4 font-medium">Ultima comandă</th>
              <th className="p-4 text-right font-medium">Total cheltuit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr key={customer.email}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-brand-emerald-soft text-sm font-semibold text-brand-emerald">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{customer.orderCount}</td>
                <td className="p-4 text-muted-foreground">{formatDate(customer.lastOrderDate)}</td>
                <td className="p-4 text-right font-medium text-foreground">
                  {formatPrice(customer.totalSpent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
